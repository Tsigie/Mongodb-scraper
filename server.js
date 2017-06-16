var express = require("express");
var express-handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var Note = require("./newyorktimes/Note.js");
var Article = require("./https://www.nytimes.com/2017/06/15/us/booz-allen-hamilton-investigation-justice-department.html/Article.js");

var cheerio = require("cheerio");
var request = require("request");

mongoose.Promise = Promise;

var app = express();

app.use(express-handlebars("express-handlebars"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {
  request("http://www.newyorktimes.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    $("article h2").rach(function(i, element) {
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("herf");

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(doc);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  newNote.save(function(error, doc) {

    if (error) {
      console.log(error);
      }

      else {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "Note": doc._id})

        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            res.send(doc);
          }
        });
      }
  });
});

app.lesten(3000, function() {
  console.log("App running on port 3000!");
});
