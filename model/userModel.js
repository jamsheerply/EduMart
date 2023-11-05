const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,required: true,
    },
    lastName: {
        type: String,required: true,
    },
    email: {
        type: String,required: true,unique: true,lowerCase: true
    },
    password: {
        type: String,required: true,
    },
    status: {
        type: String,enum: ["block", "unblock"],
        default:"unblock"
    },
    role: {
        type: String,required: true,enum: ["user"],default:"user"
    }
});
module.exports = mongoose.model("User", userSchema);