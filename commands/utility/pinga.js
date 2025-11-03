const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('pinga').setDescription('Replies with PONG!'),
  async execute(interaction) {
    await interaction.reply('**PONG!!!**');
  },
};
