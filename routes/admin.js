const express = require('express');
const path = require('path');

const productsController = require('../controllers/products')

const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

// Add product routes
router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);

module.exports = router