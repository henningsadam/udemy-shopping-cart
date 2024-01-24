const express = require('express');
const path = require('path');

const productsController = require('../controllers/products')
const cartController = require('../controllers/cart')

const router = express.Router();

router.get('/', productsController.getProducts);

// Cart routes
router.get('/cart', cartController.getCart);

module.exports = router;
