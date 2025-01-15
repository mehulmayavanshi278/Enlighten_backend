
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const {Server} = require('socket.io')

const app = express();
const server = createServer(app);


const io = new Server(server , {
  cors:{
    origin:process.env.CORS_ORIGIIN,
    methods:['get' , 'post'],
    credentials:true
  }
});





app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE" , "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection' , (socket)=>{
  console.log('new user joined with socket Id ' , socket.id);

  socket.on('change-status' , (data)=>{
    
      socket.emit('change-status' , )
  })
  socket.on('disconnect' , ()=>{
    console.log(`user ${socket.id} disconnected`)
  })
})



require("./startup/index.startup")(app, server);



module.exports.io = io;

