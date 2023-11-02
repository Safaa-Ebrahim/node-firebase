const express = require("express");
const admin = require("firebase-admin");

const imageRoute = require("./routes/imageRoute");
const imageShortingRoute = require("./routes/imageShortingRoute");

// Initialize the Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Pass the Firestore db object to the controllers
server.use((req, res, next) => {
  req.db = db;
  next();
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("Up and listenin to port", port);
});

// routes
server.use(imageRoute);
server.use(imageShortingRoute);

// not found MW
server.use((req, res, next) => {
  res.status(404).json({ msg: "not found" });
});

// error MW
server.use((error, req, res, next) => {
  res.status(error.status || 500).json({ msg: "" + error });
  // res.status(500).json({ message: "Internal sever error" });
});
