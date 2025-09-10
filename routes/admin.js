const express = require('express');
const bcrypt = require('bcryptjs');
const { ensureAdmin } = require('../middlewares/adminAuth');
const { Admin, Order, Product } = require('../models');
const { notifySuccess, notifyFailed } = require('../services/notifier');
const { getQrCode, getPairingCode } = require('../services/baileys');

const router = express.Router();

// Seed admin
router.get('/seed', async (req,res) => {
  if (await Admin.findOne({ where: { username:'admin' } })) return res.send('Admin exists');
  const password_hash = await bcrypt.hash('admin123', 10);
  await Admin.create({ username:'admin', password_hash });
  res.send('Created admin: admin / admin123');
});

router.get('/login', (req,res)=> res.render('admin/login', { title:'Admin Login' }));
router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  const a = await Admin.findOne({ where: { username } });
  if (!a) return res.render('admin/login', { title:'Admin Login', error:'Invalid' });
  const ok = await bcrypt.compare(password, a.password_hash);
  if (!ok) return res.render('admin/login', { title:'Admin Login', error:'Invalid' });
  req.session.adminId = a.id; res.redirect('/admin');
});
router.get('/logout', (req,res)=>{ req.session.destroy(()=>{}); res.redirect('/admin/login'); });

router.get('/', ensureAdmin, async (req,res) => {
  const total = await Order.count();
  const paid  = await Order.count({ where:{ status:'paid' } });
  const success = await Order.count({ where:{ status:'success' } });
  const failed  = await Order.count({ where:{ status:'failed' } });

  // Omzet/biaya/profit
  const rows = await Order.findAll({ attributes:['amount','fee','get_balance','productId','status'] , include: Product });
  let omzet = 0, biaya = 0, profit = 0;
  for (const r of rows) {
    if (['paid','success'].includes(r.status)) {
      omzet += r.amount || 0;
      const modal = (r.Product?.baseCost || 0);
      const gatewayCost = (r.fee || 0); // optional
      biaya += modal + gatewayCost;
      profit += (r.amount || 0) - modal - gatewayCost;
    }
  }
  res.render('admin/dashboard', { title:'Dashboard', stats:{ total, paid, success, failed, omzet, biaya, profit } });
});

router.get('/orders', ensureAdmin, async (req,res) => {
  const orders = await Order.findAll({ include: Product, order:[['createdAt','DESC']] });
  res.render('admin/orders', { title:'Orders', orders });
});

router.post('/orders/:reff/complete', ensureAdmin, async (req,res)=>{
  const o = await Order.findOne({ where:{ reff_id: req.params.reff } , include: Product });
  if (!o) return res.redirect('/admin/orders');
  o.status = 'success'; await o.save();
  await notifySuccess({ contact_wa:o.contact_wa, email:o.email, store:process.env.STORE_NAME, reff_id:o.reff_id });
  res.redirect('/admin/orders');
});
router.post('/orders/:reff/fail', ensureAdmin, async (req,res)=>{
  const o = await Order.findOne({ where:{ reff_id: req.params.reff } , include: Product });
  if (!o) return res.redirect('/admin/orders');
  o.status = 'failed'; await o.save();
  await notifyFailed({ contact_wa:o.contact_wa, email:o.email, store:process.env.STORE_NAME, reff_id:o.reff_id });
  res.redirect('/admin/orders');
});

// WhatsApp Connect page
router.get('/wa', ensureAdmin, async (req,res)=>{
  const qr = await getQrCode();
  const pairing = await getPairingCode();
  res.render('admin/wa', { title:'WhatsApp Connect', qr, pairing });
});

module.exports = router;
