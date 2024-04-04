const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.Mongo_URL);

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Error while connecting to DB'));

connection.once('open', ()=>{
    console.log('Database is connected');
})


