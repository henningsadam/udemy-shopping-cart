const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/', shopController.getHomepage);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteItem);

// router.post('/create-order', shopController.postOrder);
// router.get('/orders', shopController.getOrders);

module.exports = router;
