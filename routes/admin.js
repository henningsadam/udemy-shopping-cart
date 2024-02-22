const express = require('express');
const path = require('path');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post(
  '/add-product',
  isAuth,
  [
    check('title')
      .isLength({ min: 2 })
      .withMessage('Title needs 2 or more characters'),
    body('imageUrl').isURL().withMessage('Invalid URL. Please try again.'),
    body('price')
      .isFloat({ gt: 0.0 })
      .withMessage('Price must be more than $0'),
    body('description')
      .exists({ values: 'falsy' })
      .withMessage('Description required'),
  ],
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post(
  '/edit-product',
  [
    check('title')
      .isLength({ min: 2 })
      .withMessage('Title needs 2 or more characters'),
    body('imageUrl').isURL().withMessage('Invalid URL. Please try again.'),
    body('price')
      .isFloat({ gt: 0.0 })
      .withMessage('Price must be more than $0'),
    body('description')
      .exists({ values: 'falsy' })
      .withMessage('Description required'),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
