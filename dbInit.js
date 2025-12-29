const { Sequelize, DataTypes } = require('sequelize');

// Initialize database
const sqlize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'sqlite.db', // sqlite specific
});

const User = sqlize.define('user',
    {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
        }
    }
);

const Char = sqlize.define('char',
    {
        name: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['name', 'user_id'],
            },
        ],
    }
);

User.hasMany(Char, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    },
});
Char.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});

const Item = sqlize.define('item',
    {
        name: DataTypes.STRING,
        defaultUnit: {
            type: DataTypes.STRING,
        },
        defaultPrice: {
            type: DataTypes.NUMBER,
        }
    }
);

const Inventory = sqlize.define('inventory',
    {
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        itemId: {
            type: DataTypes.INTEGER,
            references: {
                model: Item,
                key: 'id'
            }
        },
        charId: {
            type: DataTypes.INTEGER,
            references: {
                model: Char,
                key: 'id',
            }
        }
    }
);

Char.belongsToMany(Item, { through: Inventory });
Item.belongsToMany(Char, { through: Inventory });

module.exports = { User, Char, Item, Inventory, sqlize };
