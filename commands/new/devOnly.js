const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  devOnly: true,

  data: new SlashCommandBuilder()
    .setName('devonly')
    .setDescription('Command\'s description'),
  async execute(interaction) {
    return await interaction.reply('This command is Dev Only. GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT! GET OUT!');
  }
}
