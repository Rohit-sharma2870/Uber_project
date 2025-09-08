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
//encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      // "https://your-frontend.onrender.com"
    ],
    credentials: true,
  })
);
//session
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "mySessions",
});
app.use(
  session({
    secret: process.env.JWT_SECRET || "uber",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  })
);

initializeSocket(server);
//routes
const userrouter = require("./routers/userrouter");
const capitanrouter = require("./routers/capitanrouter");
const maprouter = require("./routers/maprouter");
const riderouter = require("./routers/riderouter");
app.use("/users", userrouter);
app.use("/capitans", capitanrouter);
app.use("/maps", maprouter);
app.use("/rides", riderouter);
//mongoose connection
const mongooseconnecton = require("./mongodb-connection/mongoose-connection");
//connection
PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server is running at:${PORT}`);
});
