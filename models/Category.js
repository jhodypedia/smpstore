module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    image: DataTypes.STRING // URL/logo game
  });
};
