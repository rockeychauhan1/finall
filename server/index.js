const express = require("express");
const app = express();
const http = require("http");
const path = require('path');
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Serve static files from the "public" directory inside the "client" directory
app.use(express.static(path.join(__dirname, "../client/public")));

// Handle requests to the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// server.listen(3001, () => {
//   console.log("SERVER RUNNING");
// });
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});