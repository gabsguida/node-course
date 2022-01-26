const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;
const url =
  "mongodb+srv://userdev:Mg7bFALxnF4PNO9E@cluster-nodecourse.kszex.mongodb.net/test";

const client = new mongoClient(url);
let _db;

const connectMongo = async (callback) => {
  try {
    const connectedClient = await client.connect();
    _db = connectedClient.db();
    callback();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if(_db) {
    return _db
  }

  throw 'No database found.'
}

exports.connectMongo = connectMongo;
exports.getDb = getDb;
