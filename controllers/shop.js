const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getHomepage = (req, res, next) => {
  console.log(req.session.user)
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        docTitle: 'Shop Home',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        docTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render('shop/product-detail', {
        product: product,
        docTitle: 'Product | ' + product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items;
      res.render('shop/cart', {
        products: products,
        docTitle: 'My Cart',
        path: '/cart',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: { name: req.session.user.name, userId: req.session.user },
        products: products,
      });
      order.save();
    })
    .then(() => {
      return req.session.user.clearCart();
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
