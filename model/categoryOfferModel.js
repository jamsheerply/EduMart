const mongoose = require("mongoose");

const categoryOfferSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    categoryName: { type: String },
    startDate: { type: Date },
    expiryDate: { type: Date },
    discount: { type: Number },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'expired', 'deactivated'], default: 'active' }
});

module.exports = mongoose.model('categoryOffer', categoryOfferSchema);

