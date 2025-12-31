const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bigping')
        .setDescription('Replies with PONG!'),
    async execute(interaction) {
        await interaction.reply('**PONG!!!**');
    },
};
