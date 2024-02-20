const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getHomepage);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;
