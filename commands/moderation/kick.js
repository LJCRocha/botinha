const { ActionRowBuilder, InteractionContextType, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(
            (option) => option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption(
            (option) => option
                .setName('reason')
                .setDescription('The reason for kicking')
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target', true);
        const kickReason = interaction.options.getString('reason', false) ?? 'No reason provided';

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Kick')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

        const response = await interaction.reply({
            content: `Kicking user ${targetUser} for reason: ${kickReason}`,
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
                    content: `Kicked user ${targetUser} for reason: ${kickReason}`,
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await interaction.update({
                    content: `Cancelled Kick`,
                    components: []
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
};
