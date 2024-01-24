const Product = require('../models/product');

exports.getHomepage = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      docTitle: 'Shop Home',
      path: '/'
    });
  });
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      docTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    docTitle: 'My Cart',
    path: '/cart',
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  })
};