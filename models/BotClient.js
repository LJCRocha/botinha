const { Client, Collection } = require('discord.js');
const { DataTypes, Sequelize } = require('sequelize');
const db = require('../dbInit.js');

class BotClient extends Client {
    /**
    * @param {import('discord.js').ClientOptions} options
    */
    constructor(options) {
        super(options);
        // Load commands and cooldowns
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.db = db;
        this.tags = this.db.sqlize.define('tags', {
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
