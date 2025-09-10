module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },     // harga jual
    baseCost: { type: DataTypes.INTEGER, defaultValue: 0 },   // biaya modal (untuk hitung profit)
    description: DataTypes.TEXT,
    categoryId: { type: DataTypes.INTEGER, allowNull: false }
  });
};
