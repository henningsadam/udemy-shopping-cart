exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    docTitle: 'My Cart',
    path: '/cart',
  })
};