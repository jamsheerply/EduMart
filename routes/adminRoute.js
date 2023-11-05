const express=require("express")
const adminRoute=express()
const adminController=require("../controller/CategoryController")
const productController=require("../controller/productController")
const userMangementController=require("../controller/userManagmentController")
const path = require("path");
const upload=require("../midddleware/multer")


//middleWare
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

//view engine
adminRoute.set("view engine","ejs")
adminRoute.use(express.static('public'));
adminRoute.use('/admin', express.static(path.join(__dirname, 'admin')));


//..............................categoryRoute..........................
adminRoute.get("/category",adminController.loadCategory)
adminRoute.post("/category",adminController.insertCategory)
adminRoute.get("/category/edit-Category/:id",adminController.getEditCategoryId)
adminRoute.post("/category/edit-Category/:id",adminController.editCategory)
adminRoute.get("/category/delete-category",adminController.deleteCategory)
adminRoute.get("/category/recover-category",adminController.recoverCategory)

//.............................productRoute.................................
adminRoute.get("/product",productController.loadProduct)
adminRoute.get("/add-product",productController.loadAddProduct)
adminRoute.post("/add-product",upload.any(),productController.insertAddProduct)
adminRoute.get("/edit-product",productController.EditProductLoad)
adminRoute.post("/edit-product/:id",upload.any(),productController.updateProduct)
adminRoute.get("/delete-product",productController.deleteProduct)
adminRoute.get("/recover-product",productController.recoverProduct)

//.................userRoute................................................
adminRoute.get("/user",userMangementController.loadUser)
adminRoute.get("/block-user",userMangementController.blockUser)
adminRoute.get("/unblock-user",userMangementController.unBlockUser)
module.exports=adminRoute