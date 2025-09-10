require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { sequelize } = require('./models');
const { initBaileys } = require('./services/baileys');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave:false, saveUninitialized:false }));
app.use('/public', express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(expressLayouts);
app.set('layout','layouts/main');

// ✅ Middleware untuk default variable
app.use((req, res, next) => {
  res.locals.isAdmin = false; // default false untuk user publik
  next();
});

// Routes
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));
app.use('/admin/categories', require('./routes/category'));
app.use('/admin/products', require('./routes/product'));
app.use('/api', require('./routes/webhook')); // /api/webhook/deposit

sequelize.sync({ alter: true }).then(async ()=>{
  console.log('DB synced');
  await initBaileys(); // auto reconnect
  app.listen(process.env.PORT || 3000, ()=> console.log('Server running'));
});
