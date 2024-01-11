const mongoose=require("mongoose")

const couponSchema=new mongoose.Schema({
    couponName:{type:String},
    couponCode:{type:String},
    expiryDate:{type:Date},
    // statusChangeDate:{type:Date},
    createdAt:{type:Date,default:Date.now},
    discountPercentage:{type:Number},
    usageLimit:{type:Number},
    users:[{userId:{type:String},count:{type:Number},limit:{type:Number}}],
    status:{type:String,enum:["active","expired","deactive"],default:"active"},
    minimumOrderAmount:{type:Number},
    maximumDiscountAmount:{type:Number}
})

module.exports = mongoose.model("coupon", couponSchema);