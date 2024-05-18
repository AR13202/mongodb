const {MongoClient} = require('mongodb');

let dbConnection;
// to connect database globally replace localhost in MongoClient.connect 
// to the one that you have created on mongoDB ATLAS
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/bookstore')
    .then((client)=>{
      dbConnection = client.db();
      return cb();
    })
    .catch((err)=>{
      console.log(err);
      return cb(err);
    })
  },//establish connection to database
  getDb: () => dbConnection // send that connection to node
} 
//cb() here is the callback function that will be called upon successful or failed connection
