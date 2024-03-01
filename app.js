// const http = require('http'); // this is no longer required with the usage of app.listen in express

const path = require('path');
const dotenv = require('dotenv').config();
const csrf = require('csurf');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
// const morgan = require('morgan');
const fs = require('fs');
const https = require('https');

require('dotenv').config(); // Add this line to load environment variables from .env file

const dbConnectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@udemy-sandbox.rayfqu3.mongodb.net/${process.env.DB_NAME}?w=majority`;

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

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

app.use(express.urlencoded({ extended: true }));
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// The below configures the templating engine for the app, as well as defines the location to the views the templating engine will use
// See app.set() in the Express.js docs for more (https://expressjs.com/en/api.html#app.set)
app.set('view engine', 'ejs'); // this sets the template engine for the app to whatever your preference is here
app.set('views', 'views'); // this tells express where to find the views to be used by templating engine

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(helmet());
app.use(compression());
//  Use the morgan package to write logs to a file on the server
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   { flags: 'a' }
// );
// app.use(morgan('combined', { stream: accessLogStream }));

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect('/500');
});

mongoose
  .connect(dbConnectionString)
  .then((result) => {
    // Demo of manually enabling a self-signed SSL cert for HTTPS
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);  
    console.log('Connected!');
  })
  .catch((err) => console.log(err));
