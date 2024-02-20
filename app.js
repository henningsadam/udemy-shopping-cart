// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');
const dotenv = require('dotenv').config();
const csrf = require('csurf');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config(); // Add this line to load environment variables from .env file

const dbConnectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@udemy-sandbox.rayfqu3.mongodb.net/shop?w=majority`;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const sessionStore = new MongoDBStore({
  uri: dbConnectionString,
  collection: 'sessions',
});

const csrfProtection = csrf({});

app.use(express.urlencoded({ extended: true }));

// The below configures the templating engine for the app, as well as defines the location to the views the templating engine will use
// See app.set() in the Express.js docs for more (https://expressjs.com/en/api.html#app.set)
app.set('view engine', 'ejs'); // this sets the template engine for the app to whatever your preference is here
app.set('views', 'views'); // this tells express where to find the views to be used by templating engine

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(dbConnectionString)
  .then((result) => {
    app.listen(3000);
    console.log('Connected!');
  })
  .catch((err) => console.log(err));
