const { ChannelType, SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
        .setMaxLength(2_000)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Which channel to echo into')
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('input', true);
    const channel = interaction.options.getChannel('channel', false) || interaction.channel;

    const message = {
      content: input,
    };

    if (channel !== interaction.channel) {
      await interaction.reply({
        content: `Message sent to channel ${channel}`,
        flags: MessageFlags.Ephemeral,
      })

      return await channel.send(message);
    }

    return await interaction.reply(message);
  }
}

