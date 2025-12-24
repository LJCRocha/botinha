const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js");
const { UniqueConstraintError } = require("sequelize");

module.exports = {
    devonly: true,
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Fetches tag')
        .addSubcommand((subcommand) => subcommand
            .setName('find')
            .setDescription('Finds Tag in DB.')
            .addStringOption((option) => option
                .setName('tag')
                .setDescription('Tag to find')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('list')
            .setDescription('List Tags in DB.')
        )
        .addSubcommand((subcommand) => subcommand
            .setName('add')
            .setDescription('Adds tag to list')
            .addStringOption((option) => option
                .setName('tag')
                .setDescription('Tag to add')
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addStringOption((option) => option
                .setName('description')
                .setDescription('Description of added tag')
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('delete')
            .setDescription('Deletes a tag from the DB')
            .addStringOption((option) => option
                .setName('tag')
                .setDescription('Tag to delete')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('edit')
            .setDescription('Change description of tag')
            .addStringOption((option) => option
                .setName('tag')
                .setDescription('Tag to add')
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addStringOption((option) => option
                .setName('description')
                .setDescription('New description for tag')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('info')
            .setDescription('Get info on tag')
            .addStringOption((option) => option
                .setName('tag')
                .setDescription('Tag to query')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
    ,

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('structures/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand(true);
        let tagName;
        let tagDescription;
        let tag;

        switch (subCommand) {
            case 'find':
                tagName = interaction.options.getString('tag', true);

                // SELECT * FROM tags WHERE name = 'tagName' LIMIT 1
                tag = await interaction.client.tags.findOne({ where: { name: tagName } });

                if (tag) {
                    // UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName'
                    tag.increment('usage_count');

                    return interaction.reply(tag.get('description'));
                }

                return interaction.reply(`Could not find tag ${tagName}.`);

            case 'list':
                // SELECT name FROM tags
                const tagList = await interaction.client.tags.findAll({ attributes: ['name'] });
                const tagString = tagList.map((t) => t.get('name')).join(', ') || 'No tags set';

                return interaction.reply(`Tag list: \`${tagString}\``);

            case 'add':
                tagName = interaction.options.getString('tag', true);
                tagDescription = interaction.options.getString('description') ?? 'No description set';

                try {
                    // INSERT INTO tags (`name`,`description`,`username`) VALUES (tagName, tagDescription, username);
                    await interaction.client.tags.create({
                        name: tagName,
                        description: tagDescription,
                        username: interaction.user.username,
                    });

                    return interaction.reply(`Tag ${tagName} added.`);
                } catch (err) {
                    if (err = UniqueConstraintError) {
                        return interaction.reply('That tag already exists');
                    }

                    return interaction.reply(`Something went wrong with adding the tag: \`\`\`${err}\`\`\``);
                }

            case 'delete':
                tagName = interaction.options.getString('tag', true);

                // DELETE FROM tags WHERE name = 'tagName'
                const deletedRowsCount = await interaction.client.tags.destroy({ where: { name: tagName } });

                if (!deletedRowsCount) {
                    return await interaction.reply(`No such tag to delete: ${tagName}`);
                }

                return interaction.reply(`Deleted tag ${tagName}`);

            case 'edit':
                tagName = interaction.options.getString('tag', true);
                tagDescription = interaction.options.getString('description', true);

                // UPDATE tags SET description = 'tagDescription' WHERE name = 'tagName'
                const updatedRowsCount = await interaction.client.tags.update({ description: tagDescription }, { where: { name: tagName } });

                if (!updatedRowsCount) {
                    return await interaction.reply(`No such tag: ${tagName}`);
                }

                return interaction.reply(`Updated tag ${tagName}`);

            case 'info':
                tagName = interaction.options.getString('tag', true);
                tag = await interaction.client.tags.findOne({ where: { name: tagName } });

                if (tag) {
                    return interaction.reply(
                        `${tagName} was created by ${tag.get('username')} at ${tag.get('createdAt')} with description \`\`\`${tag.get('description')}\`\`\``
                    )
                }

                return interaction.reply(`No such tag: \`${tagName}\``);

            default:
                break;
        }
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('structures/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        // const subCommand = interaction.options.getSubcommand(true);
        const focusedValue = interaction.options.getFocused();

        const tagNamesRow = await interaction.client.tags.findAll({ attributes: ['name'] });

        /** @type {any[]} */
        const choices = tagNamesRow.map((t) => t.get('name'));

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    }
}
