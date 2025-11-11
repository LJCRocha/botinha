const { REST, Routes } = require('discord.js');
const { GUILD_ID, TOKEN, CLIENT_ID } = process.env;

const rest = new REST().setToken(TOKEN);

// for guild commands
rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
    .then(() => console.log('Successfully deleted all guild application commands.'))
    .catch(console.error);

// for global commands
rest
    .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
