const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const { v4: uuidv4 } = require("uuid");

const waitingusers = []

io.on("connection", function (socket) {
    
  console.log("User connected");

  socket.on("joinroom", () => {

    if (waitingusers.length == 0) {
      waitingusers.push(socket);
      return;
    }

    const roomid = uuidv4();

    const waitingUser = waitingusers.pop();
    const currentUser = socket;

    waitingUser.join(roomid);
    currentUser.join(roomid);

    io.to(roomid).emit('roomJoined', roomid);

  })

  socket.on("message", messageObject => {
    const { message, room } = messageObject;
    socket.broadcast.to(room).emit("message", message);
    /* jisne message send kiya hai use chhod kr baki sabhi ko */
  })

});



app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000);


