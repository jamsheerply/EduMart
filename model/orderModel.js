const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId ,ref:'User'},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number }
    }],
    orderStatus: { type: String, enum: ['ordered', 'shipped', 'delivered', 'out for delivery', 'cancelled', 'returned'] },
    totalAmount: { type: Number },
    shippingAddress: [{ firstName: { type: String,required: true, },
    lastName: { type: String,required: true, },
    address: { type: String,required: true, },
    city: { type: String,required: true, },
    state: { type: String,required: true, },
    postCode: { type: String,required: true, },
    email: { type: String,required: true, },
    phone: { type: String,required: true, } }],
    orderDate: { type: Date },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'] },
    paymentMethod: { type: String, enum: ['COD', 'online', 'wallet'] },
    billNumber: { type: String },
    deliveryDate: { type: Date },
    activity: [{
        date: { type: Date },
        status: { type: String },
    }],
    coupon: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('order', orderSchema);
