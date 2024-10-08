const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        price: { type: Number }
    }],
    orderStatus: { type: String, enum: ['ordered', 'shipped', 'delivered', 'out for delivery', 'cancelled', 'returned'] },
    totalAmount: { type: Number },
    shippingAddress: [{
        firstName: { type: String, required: true, },
        lastName: { type: String, required: true, },
        address: { type: String, required: true, },
        city: { type: String, required: true, },
        state: { type: String, required: true, },
        postCode: { type: String, required: true, },
        email: { type: String, required: true, },
        phone: { type: String, required: true, }
    }],
    orderDate: { type: String },
    date: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'] },
    paymentMethod: { type: String, enum: ['COD', 'online', 'wallet'] },
    billNumber: { type: String },
    orderNumber:{type: String},
    deliveryDate: { type: String },
    activity: [{
        date: { type: String },
        status: { type: String },
    }],
    coupon: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('order', orderSchema);
