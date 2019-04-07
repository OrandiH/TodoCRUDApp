//Require all database connection and configs here
require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const db_name = process.env.DB_NAME;
const url = process.env.URL
const mongoOptions = {useNewUrlParser: true};

const state = {
  db: null
};

const connect = (cb) => {
  if(state.db){
    cb();
  }
  else{
    MongoClient.connect(url,mongoOptions,(err,client) => {
      if(err){
        cb(err);
      }
      else{
        state.db = client.db(db_name);
        cb();
      }
    });
  }
}

const getPrimaryKey = (_id)=> {
  return ObjectID(_id);
}

const getDB = () => {
  return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};