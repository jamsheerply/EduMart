const categoryModel = require("../model/categoryModel")

const loadProduct = async (req, res) => {
    try {
        res.render("admin/product")
    } catch (error) {
        console.log(error.message + " loadProduct")
    }
}
const loadAddProduct = async (req, res) => {
    try {
        const categoryData=await categoryModel.find({})
        // console.log(categoryData)
        res.render("admin/addProduct",{category:categoryData})
    } catch (error) {
        console.log(error.message + "loadAddProduct")
    }
}
const insertAddProduct = async (req, res) => {
    try {
        // const main = req.files["productImage1"][0];
        // console.log(main)
        console.log(req.files)
        console.log(req.body)
    } catch (error) {
        console.log(error.message)
    }
    res.json(req.body)
}

module.exports = {
    loadProduct,
    loadAddProduct,
    insertAddProduct,

}