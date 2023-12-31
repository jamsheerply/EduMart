require("dotenv").config()
const mongoose = require("mongoose");

try {
    mongoose.connect(process.env.DB).then(()=>console.log("Connected to MongoDB"));
} catch (error) {
    console.error("Mongoose connection error:", error);
}