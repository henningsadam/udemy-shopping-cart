const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin')

const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

// /admin/product
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

// /admin/products
router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)

module.exports = router