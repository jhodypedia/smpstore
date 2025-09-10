const { Sequelize, DataTypes } = require('sequelize');
const conf = require('../config/database');
const sequelize = new Sequelize(conf.database, conf.username, conf.password, {
  host: conf.host, dialect: conf.dialect, logging: conf.logging
});

const Admin    = require('./Admin')(sequelize, DataTypes);
const Setting  = require('./Setting')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Product  = require('./Product')(sequelize, DataTypes);
const Order    = require('./Order')(sequelize, DataTypes);

// Relasi
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, Sequelize, Admin, Setting, Category, Product, Order };
