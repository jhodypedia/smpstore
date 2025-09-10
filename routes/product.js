const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');
const { ensureAdmin } = require('../middlewares/adminAuth');

router.get('/', ensureAdmin, async (req,res) => {
  const products = await Product.findAll({ include: Category, order:[['id','DESC']] });
  const cats = await Category.findAll({ order:[['name','ASC']] });
  res.render('admin/products', { title:'Products', products, cats });
});

router.post('/add', ensureAdmin, async (req,res) => {
  await Product.create({
    name: req.body.name,
    price: req.body.price,
    baseCost: req.body.baseCost || 0,
    description: req.body.description,
    categoryId: req.body.categoryId
  });
  res.redirect('/admin/products');
});

router.post('/edit/:id', ensureAdmin, async (req,res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.redirect('/admin/products');
  Object.assign(p, {
    name: req.body.name,
    price: req.body.price,
    baseCost: req.body.baseCost || 0,
    description: req.body.description,
    categoryId: req.body.categoryId
  });
  await p.save();
  res.redirect('/admin/products');
});

router.post('/delete/:id', ensureAdmin, async (req,res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/products');
});

module.exports = router;
