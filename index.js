// Require necessary discordjs classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

const { DISCORD_TOKEN } = process.env;

// Create a new client instance 
const client = new Client({ intents: GatewayIntentBits.Guilds })

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to discord with client token
client.login(DISCORD_TOKEN);

