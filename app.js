const express = require("express");
const app = express();
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require('path');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/", (req, res) => {
   res.render('index');
});

app.post("/create", (req, res) => {
   let { username, email, password, age } = req.body;

   bcrypt.genSalt(10, (err, salt) => {
      if (err) {
         return res.status(500).send('Error generating salt');
      }

      bcrypt.hash(password, salt, async (err, hash) => {
         if (err) {
            return res.status(500).send('Error hashing password');
         }

         try {
            let createdUser = await UserModel.create({
               username,
               email,
               password: hash,
               age
            });

            let token = jwt.sign({ email }, "shhhhhhh");
            res.cookie("token", token);
            res.status(201).send(createdUser);
         } catch (error) {
            res.status(500).send('Error creating user');
         }
      });
   });
});

app.get("/login", (req, res) => {
   res.render("login");
});

app.post("/login", async (req, res) => {
   let user = await UserModel.findOne({ email: req.body.email });
   if (!user) return res.send("something is wrong");

   bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (err) {
         return res.status(500).send("Error comparing passwords");
      }

      if (result) {
         let token = jwt.sign({ email: user.email }, "shhhhhhh");
         res.cookie("token", token);
         res.send("Yes, you are logged in");
      } else {
         res.send("No, you are not logged in");
      }
   });
});

app.get("/logout", (req, res) => {
   res.clearCookie("token");
   res.redirect("/");
});

app.listen(3000, () => {
   console.log("Server is running on port 3000");
});
