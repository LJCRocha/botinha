const { ActionRowBuilder, InteractionContextType, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

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
                .setMaxLength(1024)
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target', true);
        const kickReason = interaction.options.getString('reason', false) ?? 'No reason provided';

        if (interaction.user.id === targetUser.id) {
            return await interaction.reply('You can\'t kick yourself, silly.');
        }

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
            // @ts-ignore
            components: [row],
            withResponse: true,
        });

        const imageAttachment = new AttachmentBuilder('./media/fora_do_grupo.png');
        const applicationMember = await interaction.guild.members.fetch(interaction.user.id);

        const kickEmbed = new EmbedBuilder()
            .setColor(0xeedd22)
            .setTitle(`User ${targetUser.globalName ?? targetUser.username} was kicked (gone) (stolem)`)
            .setAuthor({ name: interaction.user.globalName ?? interaction.user.username, iconURL: applicationMember.displayAvatarURL() })
            // .setDescription(kickReason)
            .setThumbnail('attachment://fora_do_grupo.png')
            .addFields({ name: 'Reason', value: kickReason, inline: true })
            .setTimestamp()
            .setFooter({ text: `Executed by ${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.kick(targetUser);
                await confirmation.update({
                    content: '',
                    embeds: [kickEmbed],
                    files: [imageAttachment],
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({
                    content: `Cancelled Kick`,
                    components: []
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
};
