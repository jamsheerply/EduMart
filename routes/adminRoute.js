const express=require("express")
const adminRoute=express()
const adminController=require("../controller/adminController")
const productController=require("../controller/productController")
const path = require("path");
const upload=require("../midddleware/multer")


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

//.............................productRoute............................................
adminRoute.get("/product",productController.loadProduct)
adminRoute.get("/add-product",productController.loadAddProduct)
adminRoute.post("/add-product",upload.any(),productController.insertAddProduct)
adminRoute.get("/edit-product",productController.EditProductLoad)
adminRoute.post("/edit-product/:id",upload.any(),productController.updateProduct)

module.exports=adminRoute