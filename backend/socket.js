// socket.js
const Server=require('socket.io')
const usermodel=require('./models/usermodel')
const capitanmodel=require('./models/capitan-model')
let io; // will hold the Socket.IO instance
 function initializeSocket(server) {
  io = Server(server, {
    cors: {
            origin: [
            "http://localhost:5174", 
        "http://localhost:5173", 
        "https://uber-frontend.onrender.com"
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Example: listen for messages
    socket.on("join",async (data) =>{
        const{userid,usertype}=data;
        if(usertype=='user'){
            await usermodel.findOneAndUpdate({_id:userid},{socketId:socket.id})
        }else  if(usertype=='capitan'){
            await capitanmodel.findOneAndUpdate({_id:userid},{socketId:socket.id})
        }
      console.log("Message received:", data);

      // broadcast to everyone
      io.emit("receiveMessage", data);
    });

socket.on("update-locations", async (data) =>{
  const { userid, latitude, longitude } = data;
const lng = Number(longitude);
const lat = Number(latitude);
if (!isNaN(lng) && !isNaN(lat)) {
  await capitanmodel.findOneAndUpdate(
    { _id: userid },
    {
      $set: {
        location: {
          type: "Point",
          coordinates: [lng, lat]
        }
      }
    },
    { new: true }
  );
} else {
  console.error("Invalid coordinates:", longitude, latitude);
}
});
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

 function sendMessageToSocketId(socketId, messageobject) {
  if (io) {
    io.to(socketId).emit(messageobject.event,messageobject.data);
  } else {
    console.error("Socket.io not initialized!");
  }
}
module.exports = { initializeSocket, sendMessageToSocketId };
