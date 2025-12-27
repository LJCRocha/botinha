const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * @param {import('../models/BotClient.js')} client
    */
    execute(client) {
        client.tags.sync({ force: true });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
