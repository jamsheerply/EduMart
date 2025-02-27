const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
// const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
require("./config/dataBase");
const helmet = require("helmet");

// ..........session..................
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
  })
);

// ..........set port, listen for requests........
// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port  http://127.0.0.1:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;

//........for user routes............
const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

//......for admin routes........
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

//............ejs...........................
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//........landingPage.......................
const userAuth = require("./midddleware/UserAuth");
const adminAuth = require("./midddleware/adminAuth");
const userController = require("./controller/user/userController");
app.get(
  "/",
  userAuth.userExist,
  adminAuth.adminExist,
  userController.loadLanding
);

//..........load4o4Page............
app.all("*", (req, res) => {
  res.render("user/404");
});

//...........helmet to secure the app.........
app.use(helmet());

//..........for run in render every time

// const fetchApiData = async () => {
//   try {
//     const response = await fetch("https://edumart.onrender.com");
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     console.log("API Response:", response.status);
//   } catch (error) {
//     console.error("Error fetching API data:", error);
//   }
// };

// const intervalId = setInterval(fetchApiData, 14000);
