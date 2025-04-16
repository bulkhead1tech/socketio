import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors"
const app = express();
const server = createServer(app);
const io = new Server(server,  {cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"], 
    credentials: true 
  }});
app.use(cors())
app.get("/", (req, res)=>{
    res.send(`is joined the room`)
     
})

  
io.on("connection", (socket) => {
  console.log("User connected", socket.id)

  socket.on("join",(room)=>{
    socket.join(room)

    const rooms = Array.from(io.sockets.adapter.rooms.entries())
    .filter(([roomName, roomData]) => !roomData.has(roomName)) 
    .map(([roomName]) => roomName);
  io.emit("getrooms", rooms)  })
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
 socket.on("fetchrooms", ()=>{
  const rooms = Array.from(io.sockets.adapter.rooms.entries())
  .filter(([roomName, roomData]) => !roomData.has(roomName)) 
  .map(([roomName]) => roomName);
io.emit("getrooms", rooms)
 })

  
  socket.on("message", ({input, room, user})=>{
    console.log(input)
    socket.to(room).emit("receive",{input, server:true, user})
})

});



server.listen(3000, ()=>{
    console.log("server listening at port 3000")
});