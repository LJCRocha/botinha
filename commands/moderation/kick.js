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

        await interaction.reply({
            content: `Kicking user ${targetUser} for reason: ${kickReason}`,
            components: [row],
        });
        await interaction.guild.members.kick(targetUser);
    }
};
