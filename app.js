// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');

const express = require('express');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send('<h1>Page not found</h1>');
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000); // this is the equivalent to the node.js code we were previously using below
// const server = http.createServer(app);
// server.listen(3000);