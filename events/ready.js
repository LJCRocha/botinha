const { Events } = require('discord.js');
const force = true;

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * @param {import('../models/BotClient.js')} client
    */
    execute(client) {
        client.tags.sync({ force: force });
        client.db.sqlize.sync({ force: force });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
