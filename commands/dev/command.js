const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    devonly: true,
    data: new SlashCommandBuilder()
        .setName('command')
        .setDescription('Command\'s description')
        .addStringOption((option) => option
            .setName('option')
            .setDescription('Option\'s description')
            .setAutocomplete(true)
        ),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('structures/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        interaction.reply({
            embeds: [exampleEmbed]
        })
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('structures/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = ['sapagonda', 'liboginda', 'traturferdo', 'carapingola', 'gerúndio', 'fazêndio', 'sabugo', 'tratoresco', 'tritinbilimbolóia', 'selenemengado', 'tritistosfera', 'clerostato', 'tererrero'];

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));

    }
}
