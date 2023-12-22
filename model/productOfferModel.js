const mongoose = require("mongoose");

const productOfferSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    startDate: { type: Date },
    expiryDate: { type: Date },
    discount: { type: Number },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'expired', 'deactive'], default: 'active' }
});

module.exports = mongoose.model('productOffer', productOfferSchema);

