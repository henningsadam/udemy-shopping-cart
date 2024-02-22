const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .exists()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Invalid password. Please try again.')
      .exists()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address is forbidden');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email already in use. Please try again.');
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Invalid password. Please try again.')
      .exists()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords need to match');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get('/forgot-password', authController.getForgot);
router.post('/forgot-password', authController.postForgot);

router.get('/reset-password/:token', authController.getReset);
router.post('/reset-password', authController.postReset);

module.exports = router;
