// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');

const express = require('express');
const session = require('express-session');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const { log } = require('console');

const app = express();

app.use(express.urlencoded({ extended: true }));

// The below configures the templating engine for the app, as well as defines the location to the views the templating engine will use
// See app.set() in the Express.js docs for more (https://expressjs.com/en/api.html#app.set)
app.set('view engine', 'ejs'); // this sets the template engine for the app to whatever your preference is here
app.set('views', 'views'); // this tells express where to find the views to be used by templating engine

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(authRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
