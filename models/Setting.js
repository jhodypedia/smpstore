module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Setting', {
    key: { type: DataTypes.STRING, unique: true },
    value: DataTypes.TEXT
  });
};
