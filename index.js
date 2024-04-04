const express = require('express');
require('dotenv').config();
const app = express();
const mongo = require('./config/mongo');
const port = process.env.PORT;


app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    console.log("server is running");
})