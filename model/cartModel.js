const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number }
    }],
    totalQuantity: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model("Cart", cartSchema);
