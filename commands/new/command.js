const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command')
        .setDescription('Command\'s description'),
    async execute(interaction) {
        return;
    }
}
