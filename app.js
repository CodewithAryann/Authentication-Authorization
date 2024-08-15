const express = require ("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


app.get("/", function (req, res){
   let token = jwt.sign({email: "aryan@gmail.com"}, "check")
   res.cookie("token", token)
   console.log(token);
   res.send(done);
})

app.listen(3000);