const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('models/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const reply = await interaction.reply({ content: `Pinging...`, withResponse: true });
        const latency = reply.resource.message.createdTimestamp - interaction.createdTimestamp;

        const message = `**Pong!!!** with latency \`${latency} ms\``;
        await interaction.editReply(message);

        const random = Math.floor(Math.random() * 100);

        if (random > 90) {
            await interaction.editReply('No one will believe you');
            setTimeout(async () => await interaction.editReply(message), 500);
        }
    },
};
