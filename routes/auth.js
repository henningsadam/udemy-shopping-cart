const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/forgot-password', authController.getForgot);
router.post('/forgot-password', authController.postForgot);

router.get('/reset-password/:token', authController.getReset);
router.post('/reset-password', authController.postReset);

module.exports = router;
