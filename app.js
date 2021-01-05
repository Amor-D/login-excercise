require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost/userDB", { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
   email : String,
   password : String
});

const userModel = new mongoose.model("user", userSchema);

app.get("/", function(req, res){
   res.render("home");
});
app.get("/login", function(req, res){
   res.render("login");
});
app.get("/register", function(req, res){
   res.render("register");
});
app.post("/register", function(req, res){

   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new userModel({
         email : req.body.username,
         password : hash
      });
      newUser.save(function(err){
         if(err){
            console.log(err);
         }
         else{
            res.render("secrets");
         }
      });
   });
});
app.post("/login", function(req, res){
   userModel.findOne({email : req.body.username}, function(err, foundUser){
      if(err){
         console.log(err);
      }
      else {
         if(foundUser){
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
               if(result)
               {
                  res.render("secrets");
               }
            });

         }
      }
   })
});


app.listen(3000, function(){
   console.log("server started!");
});
