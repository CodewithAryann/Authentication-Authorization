const express = require ("express");

const app = express();

app.get("/", function (req, res){
    res.cookie("name", "Aryan");
    res.send("Done")
})

app.listen(3000);