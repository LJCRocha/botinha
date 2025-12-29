const { ActionRowBuilder, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');

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
                .setMaxLength(1024)
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target', true);
        const banReason = interaction.options.getString('reason', false) ?? 'No reason provided';

        if (interaction.user.id === targetUser.id) {
            return await interaction.reply('You can\'t ban yourself, silly.');
        }

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
            // @ts-ignore
            components: [row],
            withResponse: true,
        });

        const imageAttachment = new AttachmentBuilder('./media/fora_do_grupo.png');
        const applicationMember = await interaction.guild.members.fetch(interaction.user.id);

        const banEmbed = new EmbedBuilder()
            .setColor(0xff4400)
            .setTitle(`User ${targetUser.globalName ?? targetUser.username} was banned (gone) (stolem)`)
            .setAuthor({ name: interaction.user.globalName ?? interaction.user.username, iconURL: applicationMember.displayAvatarURL() })
            // .setDescription(banReason)
            .setThumbnail('attachment://fora_do_grupo.png')
            .addFields({ name: 'Reason', value: banReason, inline: true })
            .setTimestamp()
            .setFooter({ text: `Executed by ${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.ban(targetUser);
                await confirmation.update({
                    content: '',
                    embeds: [banEmbed],
                    files: [imageAttachment],
                    components: []
                });

            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({
                    content: `Cancelled Ban`,
                    components: []
                });
            }

        } catch (err) {
            if (err.name === 'InteractionCollectorError') {
                return await interaction.followUp('No response after 60 seconds, ban cancelled.');
            } else {
                console.error(err);
            }
        }
    }
};
