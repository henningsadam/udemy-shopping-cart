require('dotenv').config();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  const connectionStr = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@udemy-sandbox.rayfqu3.mongodb.net/shop?retryWrites=true&w=majority`;

  MongoClient.connect(connectionStr)
    .then((client) => {
      console.log('Connected!');
      _db = client.db()
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err
    });
};

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb