// socket.js
const Server = require("socket.io");
const usermodel = require("./models/usermodel");
const capitanmodel = require("./models/capitan-model");
let io; // global socket.io instance
function initializeSocket(server) {
  io = Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://uberfront.netlify.app",
        "https://68c407d0a28e710096e1b76b--uberfront.netlify.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);
    // ======================= JOIN =======================
    socket.on("join", async (data) => {
      try {
        const { userid, usertype } = data;
        console.log(" join event received:", data);

        if (usertype === "user") {
          await usermodel.findByIdAndUpdate(userid, { socketId: socket.id });
        } else if (usertype === "capitan") {
          await capitanmodel.findByIdAndUpdate(userid, { socketId: socket.id });
        }
        console.log(` ${usertype} (${userid}) linked to socket ${socket.id}`);
      } catch (err) {
        console.error(" Error in join handler:", err.message);
      }
    });
    // =================== UPDATE LOCATIONS ===================
    socket.on("update-locations", async (data) => {
      try {
        // console.log(" update-locations received:", data);
        const { userid, latitude, longitude } = data;
        const lng = Number(longitude);
        const lat = Number(latitude);

        if (!isNaN(lng) && !isNaN(lat)) {
          const updated = await capitanmodel.findByIdAndUpdate(
            userid,
            {
              $set: {
                socketId: socket.id,
                location: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              },
            },
            { new: true }
          );

          // console.log("✅ Updated capitan location:", updated?.location);
        } else {
          console.error(" Invalid coordinates:", latitude, longitude);
        }
      } catch (err) {
        console.error("Error in update-locations:", err.message);
      }
    });

    // ======================= DISCONNECT =======================
    socket.on("disconnect", async () => {
      console.log("⚠️ Client disconnected:", socket.id);
      try {
        // Mark captain as inactive on disconnect
        await capitanmodel.findOneAndUpdate(
          { socketId: socket.id },
          { $set: { status: "inactive" } }
        );
      } catch (err) {
        console.error(" Error during disconnect update:", err.message);
      }
    });
  });
}
// ================== SEND MESSAGE TO SOCKET ==================
function sendMessageToSocketId(socketId, messageobject) {
  if (io) {
    console.log(`Sending event "${messageobject.event}" to ${socketId}`);
    io.to(socketId).emit(messageobject.event, messageobject.data);
  } else {
    console.error(" Socket.io not initialized!");
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };


