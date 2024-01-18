const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const bodyParser = require('body-parser');

const router = express.Router();

const products = [];

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); // code used without rendering engine
  res.render('add-product', {docTitle: 'Add Product'})
});

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  console.log(req.body);
  res.redirect('/');
});

// router.get('/product', (req, res, next) => {
//   res.send('<h1>Product Page</h1>');
// });

exports.routes = router;
exports.products = products;
