const { REST, Routes } = require('discord.js');
const { error } = require('node:console');
const { TOKEN, CLIENT_ID, GUILD_ID, DEV } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, 'commands');
const commandsFolders = fs.readdirSync(foldersPath);

// Grab all the command files from the commands directory
for (let folder of commandsFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('js'));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (let file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.devOnly && !DEV) continue;

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// and deploy commands 
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (err) {
    console.error(error);
  }
})();

