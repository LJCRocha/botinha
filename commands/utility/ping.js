const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction) {
        const reply = await interaction.deferReply({ content: `Pinging...`, withResponse: true });
        const latency = reply.resource.message.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`**Pong!!!** with latency \`${latency} ms\``);

        const random = Math.round(Math.random() * 100);

        if (random > 90) {
            await interaction.followUp({ content: 'No one will believe you', flags: MessageFlags.Ephemeral });
        }
    },
};
