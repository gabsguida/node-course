const express = require('express');
const router = express.Router();
const adminData = require('./admin');

// renderizará a página, passando alguns dados que podem ser usados dentro do template engine
router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
});

module.exports = router;
