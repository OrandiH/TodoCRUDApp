const express = require("express");
const bodyParser = require("body-parser");
const joi = require("joi");
const app = express();
const path = require("path");
const db = require("./db");
const collection = "todo";

const schema = joi.object().keys({
  todo : joi.string().required()
});


app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//read
app.get("/getTodos", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

//update
app.put("/:id", (req, res) => {
  const todoID = req.params.id;
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
});

//insert
app.post("/", (req, res, next) => {
  const userInput = req.body;

  joi.validate(userInput,schema,(err,result)=>{
    if(err){
      const error = new Error("Invalid input");
      error.status = 400;
      next(error);
    }
    else{
      db.getDB()
      .collection(collection)
      .insertOne(userInput, (err, result) => {
      if (err) {
        const error = new Error("Failed to insert Todo Document");
        error.status = 400;
        next(error);
      } else {
        res.json({ result: result, document: result.ops[0], msg: "Successfully inserted todo!!", error:null });
      }
    });
    }
  })
  
});



//delete
app.delete("/:id", (req, res) => {
  const todoID = req.params.id;

  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
});

app.use((err,req,res,next)=>{
  res.status(err.status).json({
    error : {
      message : err.message
    }
  });
});

db.connect(err => {
  if (err) {
    console.log("unable to connect to db");
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log("Connected to database, app is on port 3000");
    });
  }
});



