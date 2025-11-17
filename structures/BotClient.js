const { Client, Collection } = require('discord.js');
const { DataTypes, Sequelize } = require('sequelize');

// Initialize database
const sqlize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: true,
    // sqlite specific
    storage: 'sqlite.db',
});

class BotClient extends Client {
    /**
    * @param {import('discord.js').ClientOptions} options
    */
    constructor(options) {
        super(options);
        // Load commands and cooldowns
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.tags = sqlize.define('tags', {
            name: {
                type: DataTypes.STRING,
                unique: true,
            },
            description: DataTypes.TEXT,
            username: DataTypes.STRING,
            usage_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        });
    }
}

module.exports = BotClient;
