const express = require('express');
const router = express.Router();
const { Category, Product, Order } = require('../models');
const { createDeposit } = require('../services/atlantic');
const { notifyPending } = require('../services/notifier');

router.get('/', async (req,res) => {
  const categories = await Category.findAll({ order:[['name','ASC']] });
  res.render('public/home', { title: 'Pilih Game', categories });
});

router.get('/topup/:catId', async (req,res) => {
  const category = await Category.findByPk(req.params.catId, { include: Product });
  if (!category) return res.status(404).send('Game tidak ditemukan');
  res.render('public/topup', { title: `Top Up ${category.name}`, category, products: category.Products });
});

router.post('/topup', async (req,res) => {
  try {
    const { categoryId, productId, player_id, nickname, email, contact_wa } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || product.categoryId != categoryId) return res.status(400).send('Produk tidak valid');

    const reff_id = 'REF' + Date.now();
    const resp = await createDeposit({ reff_id, nominal: product.price, type:'ewallet', method:'qris' });
    if (!resp?.status) throw new Error('Gagal membuat deposit');

    const d = resp.data || {};
    const order = await Order.create({
      reff_id, player_id, nickname, email, contact_wa,
      amount: product.price,
      fee: d.fee || 0,
      get_balance: d.get_balance || 0,
      atl_tx_id: d.id || null,
      qr_image: d.qr_image || null,
      productId: product.id,
      status: 'pending'
    });

    await notifyPending({ contact_wa, email, store: process.env.STORE_NAME, amount: order.amount, qr_image: order.qr_image, reff_id });

    res.render('public/thankyou', { title:'Pembayaran Dibuat', order });
  } catch (e) {
    console.log(e);
    res.status(500).send('Terjadi kesalahan.');
  }
});

module.exports = router;
