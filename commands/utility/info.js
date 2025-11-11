const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info Command')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('user')
                .setDescription('Info about the user')
                .addUserOption((option) =>
                    option
                        .setName('target')
                        .setDescription('User to be info\'d')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')
        ),

    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case 'user':
                const targetUser = interaction.options.getUser('target', false) || interaction.user;
                const userMember = await interaction.guild.members.fetch(targetUser.id);
                // interaction.user is the object representing the User who ran the command
                // interaction.member is the GuildMember object, which represents the user in the specific guild
                await interaction.reply(
                    `This user is \`${targetUser.username}\`, who joined <t:${Math.floor(userMember.joinedTimestamp / 1000)}:R>.`,
                );
                break;

            case 'server':
                // interaction.user is the object representing the User who ran the command
                // interaction.member is the GuildMember object, which represents the user in the specific guild
                await interaction.reply(
                    `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
                )
                break;

            default:
                await interaction.reply('Error: This subcommand doesn\'t exist');
                break;
        }
    }
}

