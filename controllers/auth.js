exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  res.redirect('/');
};
