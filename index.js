const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { TOKEN } = process.env;

// Create a new client instance 
const client = new Client({ intents: GatewayIntentBits.Guilds })

// Load command files
client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(foldersPath);

for (const folder of commandsFolder) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      command.path = filePath;
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Load events 

const eventsPath = path.join(__dirname, 'events');
const eventsFolder = fs.readdirSync(eventsPath);

for (let file of eventsFolder) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, event.execute); // Instead of (...args) => (event.execute(...args)));
  } else {
    client.on(event.name, event.execute); // Instead of (...args) => (event.execute(...args)));
  }
}


// Log in to discord with client token
client.login(TOKEN);
