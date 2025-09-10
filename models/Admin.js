module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Admin', {
    username: { type: DataTypes.STRING, unique: true },
    password_hash: DataTypes.STRING
  });
};
