// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');
const dotenv = require('dotenv').config();

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
  collection: 'sessions'
})

app.use(express.urlencoded({ extended: true }));

// The below configures the templating engine for the app, as well as defines the location to the views the templating engine will use
// See app.set() in the Express.js docs for more (https://expressjs.com/en/api.html#app.set)
app.set('view engine', 'ejs'); // this sets the template engine for the app to whatever your preference is here
app.set('views', 'views'); // this tells express where to find the views to be used by templating engine

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false, store: sessionStore })
);


// When you login, fetch user data. This shouldn't be done on every request like it is below.
// 1) instead of storing the user on the request (like what is happening below here), store the user in the session - ONLY AFTER they've logged in
// 2) Then, adjust all of the .render calls in the controllers which are referencing the old location of user data

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(dbConnectionString)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Adam',
          email: 'something@something.com',
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('Connected!');
  })
  .catch((err) => console.log(err));
