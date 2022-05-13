// EXPRESS
const express = require("express");
const app = express();

// BODYPARSER
const bodyParser = require("body-parser");
const bParser = bodyParser.urlencoded({ extended: true });

// MONGODB
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const url =
  "mongodb+srv://FilipSokol:admin@cluster0.brafj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", bParser, (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const sumbit = req.body.insert;
  const id = req.body.id;

  let dbo;
  let myobj;

  // DODAWANIE
  if (sumbit == "insert") {
    if (firstname != "" || lastname != "" || email != "") {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        dbo = db.db("test");
        myobj = {
          firstname: firstname,
          lastname: lastname,
          email: email,
        };
        dbo.collection("Projekt").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("Dodano do kolekcji");
          db.close();
        });
      });
    } else {
      res.send("Jedno z pól zostało niewypełnione");
    }
    res.send(firstname + " " + lastname + " " + email);
    console.log("Dane: ", req.body);
  }

  // USUWANIE
  if (sumbit == "delete") {
    if (id != "") {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        dbo = db.db("test");
        myobj = {
          id: id,
        };
        dbo
          .collection("Projekt")
          .deleteOne({ _id: ObjectId(id) }, function (err, res) {
            if (err) throw err;
            console.log("Pomyślnie usunięto z kolekcji");
            db.close();
          });
      });
    } else {
      res.send("Jedno z pól zostało niewypełnione");
    }
    console.log("Usunięto index o id: ", req.body);
  }

  // AKTUALIZOWANIE
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
