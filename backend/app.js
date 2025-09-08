const http = require("http");
const { initializeSocket } = require("./socket");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://uber-frontend.onrender.com",
    ],
    credentials: true,
  })
);
app.options("*", cors()); // handle preflight

// Session
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "mySessions",
});

// Trust proxy for secure cookies (important for Render/Heroku)
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.JWT_SECRET || "uber",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

// Sockets
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
require("./mongodb-connection/mongoose-connection");
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
