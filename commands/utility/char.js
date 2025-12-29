const { SlashCommandBuilder, EmbedBuilder, MessageFlags, } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    devonly: true,
    data: new SlashCommandBuilder()
        .setName('char')
        .setDescription('Change char in DB')
        .addSubcommand((subcommand) => subcommand
            .setName('add')
            .setDescription('Adds a character for your user.')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to add.')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('remove')
            .setDescription('Remove a character for your user.')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to remove.')
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('rename')
            .setDescription('Rename a character')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to rename.')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('newcharname')
                .setDescription('New name for the character.')
                .setRequired(true)
            )

        )
    ,

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('models/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand(true);
        const db = interaction.client.db;
        let charName = interaction.options.getString('charname', true);
        let user;
        let char;

        switch (subCommand) {
            case 'add':
                const upserted = await db.User.upsert({
                    username: interaction.user.username, user_id: interaction.user.id
                });
                user = upserted[0];
                console.log(user.toJSON());
                char = await db.Char.findOne({ where: { name: charName, user_id: user.get('user_id') } });
                if (char) {
                    return await interaction.reply({
                        content: 'Character already in DB',
                        flags: MessageFlags.Ephemeral,
                    });
                }
                await db.Char.upsert({ name: charName, user_id: user.get('user_id') });
                return await interaction.reply({
                    content: 'Added character to DB',
                    flags: MessageFlags.Ephemeral,
                });

            case 'remove':
                const destroyed = await db.Char.destroy({ where: { name: charName, user_id: interaction.user.id } })
                if (!destroyed) {
                    return await interaction.reply({
                        content: 'No such character for this user (gone) (stolem)',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                return await interaction.reply({
                    content: 'Successfully destroyed character (no mercy)',
                    flags: MessageFlags.Ephemeral,
                });

            case 'rename':
                const newCharName = interaction.options.getString('newcharname', true);
                const checkQuery = await db.Char.findOne({ where: { name: newCharName } });
                if (checkQuery) {
                    return await interaction.reply({
                        content: `Character ${newCharName} already exists for this user.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
                const [updatedRows] = await db.Char.update({ name: newCharName }, { where: { name: charName, user_id: interaction.user.id } });
                if (!updatedRows) {
                    return await interaction.reply({
                        content: `No character ${charName} found for user.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                return await interaction.reply({
                    content: 'Successfully updated character name.',
                    flags: MessageFlags.Ephemeral,
                });

            default:
                break;
        }
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('models/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        const db = interaction.client.db;

        const focusedValue = interaction.options.getFocused();
        const choices = await db.Char.findAll({ where: { user_id: interaction.user.id } });

        /** @type {any[]} */
        const nameChoices = choices.map((choice) => choice.get('name'))

        const filtered = nameChoices.filter((choice) => choice.startsWith(focusedValue));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));

    }
}
