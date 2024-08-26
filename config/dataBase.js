require("dotenv").config();
const mongoose = require("mongoose");

try {
  mongoose
    .connect(process.env.DB)
    .then(() => console.log("Connected to MongoDB"));
} catch (error) {
  console.error("Mongoose connection error:", error);
}

// const mongoose = require("mongoose");

// const url = process.env.DB;

// const connectionParams = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// };
// mongoose
//   .connect(url, connectionParams)
//   .then(() => {
//     console.log("Connected to database ");
//   })
//   .catch((err) => {
//     console.error(`Error connecting to the database. \n${err}`);
//   });
