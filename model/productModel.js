const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        unique: true,
    },
    productDescription: {
        type: String,
    },
    publisher: {
        type: String
    },
    language: {
        type: String
    },
    category: {
        type: String
    },
    productAdded: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'out_of_stock', 'low_quantity']
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    isdeleted: {
        type: Boolean,
        default: true
    },
    imageURL: [{
        productImage1: { type: String },
        productImage2: { type: String },
        productImage3: { type: String },
        productImage4: { type: String },
    }, { timestamps: true }]

})


module.exports = mongoose.model('Product', productSchema);