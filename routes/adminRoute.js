const express=require("express")
const adminRoute=express()
const adminController=require("../controller/CategoryController")
const productController=require("../controller/productController")
const userMangementController=require("../controller/userManagmentController")
const path = require("path");
const upload=require("../midddleware/multer")
const adminAuth=require("../midddleware/adminAuth")


//middleWare
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

//view engine
adminRoute.set("view engine","ejs")
adminRoute.use(express.static('public'));
adminRoute.use('/admin', express.static(path.join(__dirname, 'admin')));


//..............................categoryRoute..........................
adminRoute.get("/category",adminAuth.verifyAdmin,adminController.loadCategory)
adminRoute.post("/category",adminController.insertCategory)
adminRoute.get("/category/edit-Category/:id",adminAuth.verifyAdmin,adminController.getEditCategoryId)
adminRoute.post("/category/edit-Category/:id",adminController.editCategory)
adminRoute.get("/category/delete-category",adminAuth.verifyAdmin,adminController.deleteCategory)
adminRoute.get("/category/recover-category",adminAuth.verifyAdmin,adminController.recoverCategory)

//.............................productRoute.................................
adminRoute.get("/product",adminAuth.verifyAdmin,productController.loadProduct)
adminRoute.get("/add-product",adminAuth.verifyAdmin,productController.loadAddProduct)
adminRoute.post("/add-product",upload.any(),productController.insertAddProduct)
adminRoute.get("/edit-product",adminAuth.verifyAdmin,productController.EditProductLoad)
adminRoute.post("/edit-product/:id",upload.any(),productController.updateProduct)
adminRoute.get("/delete-product",adminAuth.verifyAdmin,productController.deleteProduct)
adminRoute.get("/recover-product",adminAuth.verifyAdmin,productController.recoverProduct)

//.................userRoute................................................
adminRoute.get("/user",adminAuth.verifyAdmin,userMangementController.loadUser)
adminRoute.get("/block-user",adminAuth.verifyAdmin,userMangementController.blockUser)
adminRoute.get("/unblock-user",adminAuth.verifyAdmin,userMangementController.unBlockUser)
module.exports=adminRoute