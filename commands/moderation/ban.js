const { ActionRowBuilder, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption(
            (option) => option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true)
        )
        .addStringOption(
            (option) => option
                .setName('reason')
                .setDescription('The reason for banning')
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target', true);
        const banReason = interaction.options.getString('reason', false) ?? 'No reason provided';

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

        const response = await interaction.reply({
            content: `Banning user ${targetUser} for reason: ${banReason}`,
            components: [row],
            withResponse: true,
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.ban(targetUser);
                await interaction.update({
                    content: `Banned user ${targetUser} for reason: ${banReason}`,
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await interaction.update({
                    content: `Cancelled Ban`,
                    components: []
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
};
