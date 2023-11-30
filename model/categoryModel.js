const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  category: { type: String, unique: true },
  date: { type: String },
  categorystatus: {
    type: Boolean,
    default: true,
  },

})
module.exports = mongoose.model("category", categorySchema);
