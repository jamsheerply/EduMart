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
    phone:{
        type:String
    },
    status: {
        type: String,enum: ["block", "unblock"],
        default:"unblock"
    },
    role: {
        type: String,required: true,enum: ["user"],default:"user"
    },
    address: [{
        firstName: { type: String,required: true, },
        lastName: { type: String,required: true, },
        address: { type: String,required: true, },
        city: { type: String,required: true, },
        state: { type: String,required: true, },
        postCode: { type: String,required: true, },
        email: { type: String,required: true, },
        phone: { type: String,required: true, }
    }],
});
module.exports = mongoose.model("User", userSchema);