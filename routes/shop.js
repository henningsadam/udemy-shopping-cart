const path = require('path')

const express = require('express')

const rootDir = require('../util/path')
const adminData = require('./admin');

const router = express.Router()

router.get('/', (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = adminData.products
  res.render('shop', {prods: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0}) // The render method will use the default templating engine
});

module.exports = router