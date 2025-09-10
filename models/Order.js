module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    reff_id: { type: DataTypes.STRING, unique: true },
    player_id: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_wa: DataTypes.STRING,
    amount: DataTypes.INTEGER,       // diisi = product.price
    fee: { type: DataTypes.INTEGER, defaultValue: 0 }, // dari Atlantic jika ada
    get_balance: { type: DataTypes.INTEGER, defaultValue: 0 },
    atl_tx_id: DataTypes.STRING,
    qr_image: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending','paid','processing','success','failed','canceled'),
      defaultValue: 'pending'
    },
    productId: DataTypes.INTEGER
  });
};
