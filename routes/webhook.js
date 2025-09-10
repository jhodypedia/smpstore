const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const { verifyWebhook } = require('../services/atlantic');
const { notifyPaid } = require('../services/notifier');

router.post('/webhook/deposit', async (req,res) => {
  try {
    if (!verifyWebhook(req.headers)) return res.status(401).json({ ok:false, msg:'invalid signature' });
    const p = req.body || {};
    if (p.event !== 'deposit') return res.json({ ok:true });

    const d = p.data || {};
    const order = await Order.findOne({ where: { reff_id: d.reff_id } });
    if (!order) return res.json({ ok:true, msg:'order not found' });

    const st = (d.status || '').toLowerCase();
    if ((st === 'processing' || st === 'success') && order.status === 'pending') {
      order.status = 'paid';
      await order.save();
      await notifyPaid({ contact_wa: order.contact_wa, email: order.email, store: process.env.STORE_NAME, reff_id: order.reff_id });
    }
    if (st === 'failed' || st === 'cancel') {
      order.status = 'failed';
      await order.save();
    }
    res.json({ ok:true });
  } catch (e) {
    console.log('webhook err', e);
    res.status(500).json({ ok:false });
  }
});

module.exports = router;
