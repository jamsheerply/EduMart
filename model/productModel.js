const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    description: { type: String, required: true },

    image: [{
        Child_four: { type: String },
        Child_one: { type: String },
        Child_three: { type: String },
        Child_two: { type: String },
        Main: { type: String },
    }],
    status: { type: String, enum: ['draft', 'published', 'out_of_stock', 'low_quantity'] },
    product_added: { type: Date },
    price: { type: Number, required: true },
    rating: { type: Number },
}, { timestamps: true });

module.exports=mongoose.model("Product", productSchema);