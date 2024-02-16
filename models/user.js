const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    // let dbOp;
    // if (this._id) {
    //   dbOp = db.collection('users').updateOne(
    //     {
    //       _id: this._id,
    //     },
    //     { $set: this }
    //   );
    // } else {
    //   dbOp = db.collection('users').insertOne(this);
    // }

    return db
      .collection('users')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((userId) => {
        console.log(userId);
        return userId;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
