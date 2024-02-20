const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('65d2a29449fd30868c4b1e99')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
