const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); // code used without rendering engine
  res.render('add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true, 
    formsCSS: true,
  });
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/');
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => { 
    res.render('shop', {
      prods: products,
      docTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    }); // The render method will use the default templating engine
   })

}