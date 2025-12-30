const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    devOnly: true,

    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command')
        .addStringOption(
            (option) => option
                .setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .setDefaultMemberPermissions(0),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction & {client: import('models/BotClient.js')}} interaction
     */
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        try {
            delete require.cache[require.resolve(command.path)];

            const newCommand = require(command.path);
            newCommand.path = command.path;
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (err) {
            console.error(err);
            await interaction.reply(
                `There was an error while reloading a command \`${command.data.name}\`:\n\`\`\`${err.message}\`\`\``,
            );
        }
    },

    /**
    * @param {import('discord.js').AutocompleteInteraction & {client: import('models/BotClient.js')}} interaction
    */
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [];

        const foldersPath = path.join(__dirname, '..');
        const commandsFolder = fs.readdirSync(foldersPath);

        for (const folder of commandsFolder) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('js'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) choices.push(command.data.name);
            }
        }

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

        return await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    }
}
