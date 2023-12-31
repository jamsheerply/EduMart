const orderModel = require("../../model/orderModel");
const productModel = require("../../model/productModel")
// const moment = require("moment")

//...................................loadOrderConfirmation.........................
const loadOrderConfirmation = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        if (!req.session.userData) {
            const userId = req.session.userData._id;
            const userData = await userModel.findById(userId)
        }
        const orderId = req.session.orderId
        const shippingAddress = req.session.shippingAddress

        res.render("user/orderConfirmation", { orderId, shippingAddress })
    } catch (error) {
        console.error(error.message + " loadOrderConfirmation")
    }
}

//....................................loadOrderList............................
const loadOrderList = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const orderData = await orderModel.find({ userId: userId }).sort({ orderDate: -1 }).populate("products.productId");

        res.render("user/orderList", { orderData: orderData })
    } catch (error) {
        console.error(error.message + " loadOrderList")
    }
}

//.................................loadOrderDetail..................................
const loadOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.OrderId
        const orderData = await orderModel.findById({ _id: orderId }).populate("products.productId")
        res.render("user/orderDetail", { orderData: orderData })
    } catch (error) {
        console.error(error.message + "orderDetail")
    }
}

//......................................updateOrderDetail............................
const updateOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        if (!orderId || !orderStatus) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const updateOrder = await orderModel.findByIdAndUpdate(
            { _id: orderId },
            { $set: { orderStatus: orderStatus } },
            { new: true } // To return the updated order
        );

        if (updateOrder) {
            return res.json({ orderStatus: updateOrder.orderStatus });
        } else {
            return res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error(error.message + " insertOrderDetail");
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    loadOrderConfirmation,
    loadOrderDetail,
    loadOrderList,
    updateOrderDetail
}