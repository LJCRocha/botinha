const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a die')
        .addIntegerOption((option) => option
            .setName('diesides')
            .setDescription('Number of sides of the rolled die')
            .setMinValue(2)
        ),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('structures/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const dieSides = interaction.options.getInteger('diesides') || 20;
        const result = Math.floor(Math.random() * dieSides) + 1;

        const dieEmbed = new EmbedBuilder()
            .setColor(0x0022ff)
            .setTitle(`You rolled a ${result}!!!`)
            .setAuthor({ name: `${interaction.user.globalName ?? interaction.user.username} rolled a ${dieSides} sided die!`, iconURL: interaction.user.displayAvatarURL() })
            // TODO: Set thumbnail based on result with canvas
            // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()

        const mediaPath = path.join(__dirname, '..', '..', 'media');
        const exts = ['.png', '.jpg', '.jped', '.webp', '.gif'];
        let reply = { embeds: [dieEmbed] };

        if (result == 1) {
            const minFilesPath = path.join(mediaPath, 'MinRoll');
            const minFiles = fs.readdirSync(minFilesPath)
                .filter((file) => exts.some((ext) => file.endsWith(ext)));

            if (minFiles.length !== 0) {
                const attachmentFile = minFiles[Math.floor(Math.random() * minFiles.length)];
                const attachmentFilePath = path.join(mediaPath, 'MinRoll', attachmentFile);

                const imageAttachment = new AttachmentBuilder(attachmentFilePath);
                dieEmbed.setImage('attachment://' + attachmentFile)
                    .setFooter({ text: attachmentFile.replaceAll('_', ' ') });
                reply.files = [imageAttachment];
            }

        } else if (result == dieSides) {
            const maxFilesPath = path.join(mediaPath, 'MaxRoll');
            const maxFiles = fs.readdirSync(maxFilesPath)
                .filter((file) => exts.some((ext) => file.endsWith(ext)));

            if (maxFiles.length !== 0) {
                const attachmentFile = maxFiles[Math.floor(Math.random() * maxFiles.length)];
                const attachmentFilePath = path.join(mediaPath, 'MaxRoll', attachmentFile);

                const imageAttachment = new AttachmentBuilder(attachmentFilePath);
                dieEmbed.setImage('attachment://' + attachmentFile)
                    .setFooter({ text: attachmentFile.replaceAll('_', ' ') });
                reply.files = [imageAttachment];
            }
        }

        await interaction.reply(reply);

        if (result == 69) {
            await interaction.followUp('Nice.');
        }
    },

}
