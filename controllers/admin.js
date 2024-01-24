const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); // code used without rendering engine
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};


exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      docTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};