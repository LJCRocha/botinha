const { SlashCommandBuilder, EmbedBuilder, MessageFlags, } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    devonly: true,
    data: new SlashCommandBuilder()
        .setName('inv')
        .setDescription('Manage Inventory in DB.')
        .addSubcommand((subcommand) => subcommand
            .setName('add')
            .setDescription('Adds an item to your character')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('itemname')
                .setDescription('Item to add')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addIntegerOption((option) => option
                .setName('itemcount')
                .setDescription('Number of items (defaults to 1)')
            )
        )

        .addSubcommand((subcommand) => subcommand
            .setName('remove')
            .setDescription('Remove a character for your user.')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to remove the item of.')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('itemname')
                .setDescription('Item to remove')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addIntegerOption((option) => option
                .setName('itemcount')
                .setDescription('Amount of items to remove (defaults to all).')
            )
        )

        .addSubcommand((subcommand) => subcommand
            .setName('list')
            .setDescription('Lists items for a char (all items if no char).')
            .addStringOption((option) => option
                .setName('charname')
                .setDescription('Name of the character to remove the item of.')
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

        if (subCommand == 'add') {
            const charName = interaction.options.getString('charname', true);
            const itemName = interaction.options.getString('itemname', true);
            const itemCount = interaction.options.getInteger('itemcount') ?? 1;

            const char = await db.Char.findOne({ where: { name: charName, user_id: interaction.user.id } });
            if (!char) {
                return await interaction.reply({
                    content: `No such character \'${charName}\' for user`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const [item] = await db.Item.findOrCreate({ where: { name: itemName } });

            const [charInventory] = await db.Inventory.findOrCreate({ where: { itemId: item.get('id'), charId: char.get('id') } });
            charInventory.increment(['amount'], { by: itemCount });

            return await interaction.reply({
                content: `Added ${itemCount} item(s) to ${charName}.`,
                flags: MessageFlags.Ephemeral,
            });

        } else if (subCommand == 'remove') {
            const charName = interaction.options.getString('charname', true);
            const itemName = interaction.options.getString('itemname', true);
            let itemCount = interaction.options.getInteger('itemcount');

            const char = await db.Char.findOne({ where: { name: charName, user_id: interaction.user.id } });
            if (!char) {
                return await interaction.reply({
                    content: `No such character \'${charName}\' for user`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const item = await db.Item.findOne({ where: { name: itemName } });
            if (!item) {
                return await interaction.reply({
                    content: `No such item \'${itemName}\' in DB.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const charInventory = await db.Inventory.findOne({ where: { itemId: item.get('id'), charId: char.get('id') } });
            if (!charInventory) {
                return await interaction.reply({
                    content: `No such item \'${itemName}\' for character \'${charName}\'.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            if (itemCount === null) {
                // @ts-ignore
                itemCount = charInventory.get('amount');
            }

            await charInventory.decrement(itemCount);
            await charInventory.reload();
            return await interaction.reply({
                content: `Decreased ${charName} ${itemName} to ${charInventory.get('amount')}.`,
                flags: MessageFlags.Ephemeral,
            });
        } else if (subCommand === 'list') {
            const charName = interaction.options.getString('charname', true);

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Items of ${charName}:`)
                .setAuthor({ name: interaction.user.globalName ?? interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                .setTimestamp()
                .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            const char = await db.Char.findOne({
                where: { user_id: interaction.user.id, name: charName },
                include: [{
                    model: db.Item,
                    through: {
                        attributes: ['amount']
                    }
                }]
            });

            const itemsList = /** @type {any[]} */ (char.get('items'));

            // TODO: add char count logic
            for (const item of itemsList) {
                const inv = item.get('inventory');
                embed.addFields({ name: item.get('name'), value: String(inv.get('amount')) });
            }

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            })

        }
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('models/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        const db = interaction.client.db;
        const choices = ['sapagonda', 'liboginda', 'traturferdo', 'carapingola', 'gerúndio', 'fazêndio', 'sabugo', 'tratoresco', 'tritinbilimbolóia', 'selenemengado', 'tritistosfera', 'clerostato', 'tererrero'];

        const focusedValue = interaction.options.getFocused(true);
        if (focusedValue.name === 'charname') {
            const charChoices = await db.Char.findAll({ where: { user_id: interaction.user.id } });

            /** @type {any[]} */
            const nameChoices = charChoices.map((choice) => choice.get('name'))

            const filtered = nameChoices.filter((choice) => choice.toLowerCase().startsWith(focusedValue.value.toLowerCase()));

            return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));

        } else if (focusedValue.name === 'itemname') {

            const charChoices = await db.Char.findAll(
                {
                    where: { user_id: interaction.user.id },
                    include: db.Item,
                }
            );

            /** @type {any[]} */
            const itemChoices = charChoices.flatMap((char) => char.get('items'))

            const nameChoices = itemChoices.flatMap((item) => item.get('name'));


            const filtered = new Set(nameChoices.filter((name) => name.toLowerCase().startsWith(focusedValue.value.toLowerCase())));

            return await interaction.respond([...filtered].map((choice) => {
                return { name: choice, value: choice };
            }));

        }

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue.value));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    }
}
