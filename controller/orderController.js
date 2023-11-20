const orderModel=require("../model/orderModel");
const productModel=require("../model/productModel")
// const { render } = require("../routes/userRoute");

const loadOrderConfirmation=async(req,res)=>{
    try {
        const userId = req.session.userData._id;
        if (!req.session.userData) {
            const userId = req.session.userData._id;
            const userData = await userModel.findById(userId)
        }
        res.render("user/orderConfirmation")
    } catch (error) {
        console.log(error.message+" loadOrderConfirmation")
    }
}
const loadOrderList=async(req,res)=>{
    try {
        const userId = req.session.userData._id;
        const orderData= await orderModel.find({userId:userId}).populate("products.productId")

        res.render("user/orderList",{orderData:orderData})
    } catch (error) {
        console.log(error.message+ " loadOrderList")
    }
}
const loadOrderDetail=async(req,res)=>{
    try {

        res.render("user/orderDetail")
    } catch (error) {
        console.log(error.message+ "orderDetail")
    }
}
module.exports={
    loadOrderConfirmation,
    loadOrderDetail,
    loadOrderList
}