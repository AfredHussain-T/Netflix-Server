const express = require('express');
require('dotenv').config();
const app = express();
const mongo = require('./config/mongo');
const port = process.env.PORT;
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    console.log("server is running");
})