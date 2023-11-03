const mongoose =require("mongoose")
const productSchema= new mongoose.Schema({
    productName:{
        type:String,
        unique:true,
    },
    productDescription:{
        type:String,
    },
    publisher:{
        type:String
    },
    language:{
        type:String
    },
    status:{
        type:String, 
        enum: ['draft', 'published', 'out_of_stock', 'low_quantity'] 
    },
    price:{
        type:String
    },
    image: [{
        childFour: { type: String },
        childOne: { type: String },
        childThree: { type: String },
        childTwo: { type: String },
        main: { type: String },
     },{ timestamps: true }]

})


module.exports = mongoose.model('Product', productSchema);