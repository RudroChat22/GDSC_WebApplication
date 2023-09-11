

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"
const app = express()

app.use(express.static("public"));

const db=""//make a mongodb account and copy paste your mongo db id in here to link this project with the mongo database


mongoose
  .connect(db)
  .then(() => {
    console.log("Connection Successful at PORT");
  })
  .catch((e) => {
    console.log(e);
  });
const Schema= mongoose.Schema;

const userSchema= new Schema({
    
    username:{
    type: String,
    required:[true, "No username entered!"]
},
    email:{
    type: String,
    required:[true, "No email entered!"]
},
    password:{
        type:String,
        required:[true, "No password entered!"],
        minLength: 8
    }
});
const User=mongoose.model('User',userSchema);

app.use('/stylesheets',express.static('stylesheets'))

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:true}))
app.get('/signup',(req,res) => {
    res.render('signup.ejs')
})
let homeLocals = {data:null,  message:null};
app.get("/home", (req, res)=>{
  res.render("home.ejs", homeLocals);
});
app.get('/login',(req,res) => {
    res.render('login.ejs')
})
app.post('/signup', (req,res) => {
    var userData = req.body;
  if(userData.password.length>=8){
    User.countDocuments({$or:[{username: userData.username}, {email: userData.email}]}).then((count)=>{
      if(count==0){
        User.insertMany([userData]);
        homeLocals.data = userData;
        homeLocals.message = "User registered successfully."
        res.redirect("/home");
      } else {
        res.render("signup.ejs", {message: "User already exists. Please try again."});
      }
    });
  } else {
    res.render("signup.ejs", {message: "Password must be atleast 8 characters long."});
  }

})
app.post('/login',(req,res) => {
    var userData = req.body;

  User.findOne({username: userData.username}).then((response)=>{

    if(userData.password===response.password){
      homeLocals.message = "Successfully logged in";
      homeLocals.data  = response;
      res.redirect("/home");
    } else {
      res.render("login.ejs", {message: "Incorrect Password."});
    }

  });

})
app.listen(3000, "0.0.0.0",()=>{
    console.log("port 3000!!");
})


