//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
app.use(cors());

// const encrypt = require('mongoose-encryption');
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// console.log(process.env.SECRET);
// secret = process.env.SECRET;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//session
app.use(
  session({
    secret: "iamthesecret",
    resave: false,
    saveUninitialized: false,
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());

const uri =
  "mongodb+srv://godricvasa:WBJs0Bf2T9mAyteb@saacluster.fwzdspd.mongodb.net/authDB";
const url = "mongodb://localhost:27017/authDB";
mongoose.connect(url);

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
});
//encryption

// UserSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

//passport-mongoose-local
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

//model
const User = mongoose.model("User", UserSchema);

//create strategy using passport from mongoose
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const GOOGLE_CLIENT_ID = process.env.CLIENTID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENTSECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    // console.log(profile);
    res.redirect("http://localhost:5173/");
  }
);

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  try {
    await User.register({ username: req.body.username }, req.body.password);
    passport.authenticate("local")(req, res, () => {
      res.redirect("http://localhost:5173/");
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
app.post("/login", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.logIn(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("http://localhost:5173/");
      });
    }
  });
});

app.listen(3000, function () {
  console.log("running on port 3000");
});
