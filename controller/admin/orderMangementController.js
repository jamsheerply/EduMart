const orderModel = require("../../model/orderModel")

//...........................loadOrder...........................
const loadOrder = async (req, res) => {
    try {
        const orderData = await orderModel.find({}).sort({ orderDate: -1 }).populate("userId").limit(8);
        const orderDataCount = await orderModel.find({}).sort({ orderDate: -1 }).populate("userId").count();
        const orderPageCount = Math.ceil(orderDataCount / 8)
        res.render("admin/order", { orderData: orderData, orderPageCount:orderPageCount})

    } catch (error) {
        console.error(error.message)
    }
}

//.........................orderPagination............................
const orderPagination=async(req,res)=>{
    try {
        const orderPageNumber=Number(req.query.orderPageCount)
        const orderLimitPage=8
        const skiporder=(orderPageNumber-1)*orderLimitPage
        const orderData=await orderModel
        .find({}).sort({ orderDate: -1 }).populate("userId")
        .skip(skiporder).limit(orderLimitPage)
        res.json({orderData:orderData,orderPageNumber:orderPageNumber})
    } catch (error) {
        console.error(error.message+" orderPagination")
    }
}

//......................loadOrderDetail........................................
const loadOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.orderId
        const orderData = await orderModel.findById(orderId).populate("userId").populate("products.productId")
        res.render("admin/orderDetail", { orderData: orderData })
    } catch (error) {
        console.error(error.message + " loadOrderDetail")
    }
}

//...................................insertOrderDetail............................
const insertOrderDetail = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const { orderId } = req.params;

        const updateOrder = await orderModel.findOneAndUpdate(
            { _id: orderId },
            {
                $set: {
                    orderStatus: orderStatus,
                    paymentStatus: paymentStatus
                }
            },
            { new: true }
        );

        if (updateOrder) {
            return res.json({ status: true, data: updateOrder });
        } else {
            return res.json({ status: false, message: 'Failed to update order details' });
        }
    } catch (error) {
        console.error(error.message + " insertOrderDetail");
        return res.status(500).json({ status: false, error: error.message });
    }
};

module.exports = {
    loadOrder,
    orderPagination,
    loadOrderDetail,
    insertOrderDetail
}