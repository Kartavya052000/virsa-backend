const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();

const { MONGO_URL, PORT } = process.env;
const authRoute = require("./Routes/AuthRoute");
const postRoute = require("./Routes/PostRoute")
const payRoute = require("./Routes/PayRoute")
const bookRoute = require("./Routes/BookRoute")
const Grouproute = require("./Routes/GroupRoute");
const Contactroute = require("./Routes/ContactRoute")
// app.use(cors({
//     origin: [
//       "http://localhost:3001",
//       "http://localhost:3000"
     
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }));
// app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error(err));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use("/", authRoute);
  app.use("/", postRoute);
  app.use("/", payRoute);
  app.use("/", bookRoute);
  app.use("/",Grouproute)
  app.use("/",Contactroute)
  //   app.listen(PORT, () => {

  //   console.log(`Server is listening on port ${PORT}`);
  // });
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
  });

