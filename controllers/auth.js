const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv').config();
const mailgunTransporter = require('nodemailer-mailgun-transport');
const { error } = require('console');

const transporter = nodemailer.createTransport(
  mailgunTransporter({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }

  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    errorMessage: errorMessage,
    successMessage: successMessage,
    validationErrors: [],
    formData: {
      email: '',
      password: '',
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      docTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      formData: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          docTitle: 'Login',
          path: '/login',
          errorMessage: 'No account found with that email address. Please try again.',
          formData: {
            email: email,
            password: password,
          },
          validationErrors: errors.array({path: 'email'}),
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doesMatch) => {
          if (doesMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            docTitle: 'Login',
            path: '/login',
            errorMessage: 'Invalid password. Please try again.',
            formData: {
              email: email,
              password: password,
            },
            validationErrors: errors.array({path: 'password'}),
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    docTitle: 'Sign Up',
    path: '/signup',
    errorMessage: message,
    oldInput: { email: '', password: '', comfirmPassword: '' },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      docTitle: 'Sign Up',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        comfirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
      return transporter.sendMail({
        from: 'welcome@udemy-node.com',
        to: 'hennings.adam.dev+test@gmail.com',
        subject: 'Welcome to the Node.js shop!',
        html: '<b>Congrats! Your account was created!</b>',
      });
    })
    .catch((err) => console.log(err));
};

exports.getForgot = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/forgot-password', {
    docTitle: 'Forgot Password',
    path: '/forgot-password',
    errorMessage: message,
  });
};

exports.postForgot = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/forgot-password');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account found.');
          return res.redirect('/forgot-password');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        req.flash('success', 'Password reset email sent.');
        res.redirect('/login');
        transporter.sendMail({
          from: 'welcome@udemy-node.com',
          to: 'hennings.adam.dev+test@gmail.com',
          subject: '[TEST] Password Reset',
          html: `
          <p>The account associated with '${req.body.email}' requested a password reset. Click on the link below to continue.</p>
          <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
        `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render('auth/reset-password', {
        userId: user._id.toString(),
        passwordToken: token,
        docTitle: 'Reset` Password',
        path: '/reset-password',
        errorMessage: message,
      });
    })
    .catch((err) => console.log(err));
};

exports.postReset = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  if (newPassword !== confirmPassword) {
    req.flash('error', 'Passwords do not match. Please try again.');
    res.redirect('/reset-password/' + passwordToken);
  } else {
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then((result) => {
        console.log('Password successfully reset!');
        req.flash('success', 'Password reset successfully!');
        res.redirect('/login');
      })
      .catch((err) => console.log(err));
  }
};
