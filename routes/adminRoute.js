const express=require("express")
const adminRoute=express()
const adminController=require("../controller/adminController")
const path = require("path");


//middleWare
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

//view engine
adminRoute.set("view engine","ejs")
adminRoute.use(express.static('public')); // Replace 'public' with the correct folder name
adminRoute.use('/admin', express.static(path.join(__dirname, 'admin')));


//..............................categoryRoute..........................
adminRoute.get("/category",adminController.loadCategory)
adminRoute.post("/category",adminController.insertCategory)
adminRoute.get("/category/edit-Category/:id",adminController.getEditCategoryId)
adminRoute.post("/category/edit-Category/:id",adminController.editCategory)
adminRoute.get("/category/delete-category",adminController.deleteCategory)
adminRoute.get("/category/recover-category",adminController.recoverCategory)

//.............................product............................................
adminRoute.get("/product",adminController.loadProduct)
adminRoute.get("/add-product",adminController.loadAddProduct)
adminRoute.get("/add-product-test",adminController.loadAddProductTest)
// adminRoute.get("/product/single-product",adminController.loadSingleProduct)


module.exports=adminRoute