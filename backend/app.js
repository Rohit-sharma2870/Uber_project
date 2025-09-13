const http = require("http");
const { initializeSocket } = require("./socket");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express(); // ✅ define app first
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin:isProduction
  ? ["https://uberfront.netlify.app", "https://68c407d0a28e710096e1b76b--uberfront.netlify.app"]
  : ["http://localhost:5173"],
    credentials: true,
  })
);

// ✅ cookie parser must come after app is defined
app.use(cookieParser());

// Initialize socket
initializeSocket(server);

// Routes
const userrouter = require("./routers/userrouter");
const capitanrouter = require("./routers/capitanrouter");
const maprouter = require("./routers/maprouter");
const riderouter = require("./routers/riderouter");

app.use("/users", userrouter);
app.use("/capitans", capitanrouter);
app.use("/maps", maprouter);
app.use("/rides", riderouter);

// MongoDB connection
const mongooseconnecton = require("./mongodb-connection/mongoose-connection");

// Connection
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at:${PORT}`);
});
