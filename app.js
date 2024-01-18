// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');

const express = require('express');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// The below configures the templating engine for the app, as well as defines the location to the views the templating engine will use
// See app.set() in the Express.js docs for more (https://expressjs.com/en/api.html#app.set)
app.set('view engine', 'ejs') // this sets the template engine for the app to whatever your preference is here
app.set('views', 'views') // this tells express where to find the views to be used by templating engine

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send('<h1>Page not found</h1>');
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.render('404', {docTitle: 'Page Not Found'})
});

app.listen(3000); // this is the equivalent to the node.js code we were previously using below
// const server = http.createServer(app);
// server.listen(3000);