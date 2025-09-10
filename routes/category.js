const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { ensureAdmin } = require('../middlewares/adminAuth');

router.get('/', ensureAdmin, async (req,res) => {
  const cats = await Category.findAll({ order:[['id','DESC']] });
  res.render('admin/categories', { title:'Categories', cats });
});

router.post('/add', ensureAdmin, async (req,res) => {
  await Category.create({ name:req.body.name, description:req.body.description, image:req.body.image });
  res.redirect('/admin/categories');
});

router.post('/edit/:id', ensureAdmin, async (req,res) => {
  const c = await Category.findByPk(req.params.id);
  if (!c) return res.redirect('/admin/categories');
  c.name = req.body.name; c.description = req.body.description; c.image = req.body.image;
  await c.save();
  res.redirect('/admin/categories');
});

router.post('/delete/:id', ensureAdmin, async (req,res) => {
  await Category.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/categories');
});

module.exports = router;
