const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js");
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
            .setName('rm')
            .setDescription('Remove a character for your user.')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to remove.')
                .setAutocomplete(true)
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
                    return await interaction.reply('Character already in DB');
                }
                await db.Char.upsert({ name: charName, user_id: user.get('user_id') });
                return await interaction.reply('Added character to DB');

            case 'rm':
                const destroyed = await db.Char.destroy({ where: { name: charName, user_id: interaction.user.id } })
                if (!destroyed) {
                    return await interaction.reply('No such character for this user (gone) (stolem)')
                }
                return await interaction.reply('Successfully destroyed character (no mercy)')

            default:
                break;
        }
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('models/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        const subCommand = interaction.options.getSubcommand(true);
        const db = interaction.client.db;

        if (subCommand == 'rm') {
            const focusedValue = interaction.options.getFocused();
            const choices = await db.Char.findAll({ where: { user_id: interaction.user.id } });

            /** @type {any[]} */
            const nameChoices = choices.map((choice) => choice.get('name'))

            const filtered = nameChoices.filter((choice) => choice.startsWith(focusedValue));

            return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
        }

        const focusedValue = interaction.options.getFocused();
        const choices = ['sapagonda', 'liboginda', 'traturferdo', 'carapingola', 'gerúndio', 'fazêndio', 'sabugo', 'tratoresco', 'tritinbilimbolóia', 'selenemengado', 'tritistosfera', 'clerostato', 'tererrero'];

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));

    }
}
