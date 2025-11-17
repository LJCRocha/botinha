const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starters')
        .setDescription('Choose your starter pokemon!'),

    async execute(interaction) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId('menu')
            .setPlaceholder('Choose your starter!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bulbasaur')
                    .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                    .setValue('bulbasaur'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Charmander')
                    .setDescription('The Fire-type Lizard Pokémon.')
                    .setValue('charmander'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Squirtle')
                    .setDescription('The Water-type Tiny Turtle Pokémon.')
                    .setValue('squirtle'),
            );

        const row = new ActionRowBuilder().addComponents(menu);

        const response = await interaction.reply({
            content: 'Choose a starter Pokemon',
            components: [row],
            withResponse: true,
        });

        const collector = response.resource.message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000,
        });

        collector.on('collect', async (i) => {
            const selection = i.values[0];
            await i.reply(`${i.user} has selected ${selection}`);
        });
    }
}
