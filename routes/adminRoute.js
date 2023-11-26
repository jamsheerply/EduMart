const express=require("express")
const adminRoute=express()
const CategoryController=require("../controller/admin/CategoryController")
const productController=require("../controller/admin/productController")
const userMangementController=require("../controller/admin/userManagmentController")
const orderMangementController=require("../controller/admin/orderMangementController")
const dashboardController=require("../controller/admin/dashboardController")
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
adminRoute.get("/category",adminAuth.verifyAdmin,CategoryController.loadCategory)
adminRoute.post("/category",CategoryController.insertCategory)
adminRoute.get("/category/edit-Category/:id",adminAuth.verifyAdmin,CategoryController.getEditCategoryId)
adminRoute.post("/category/edit-Category/:id",CategoryController.editCategory)
adminRoute.get("/category/delete-category",adminAuth.verifyAdmin,CategoryController.deleteCategory)
adminRoute.get("/category/recover-category",adminAuth.verifyAdmin,CategoryController.recoverCategory)

//.............................productRoute.................................
adminRoute.get("/products",adminAuth.verifyAdmin,productController.loadProduct)
adminRoute.get("/add-product",adminAuth.verifyAdmin,productController.loadAddProduct)
adminRoute.post("/add-product",upload.any(),productController.insertAddProduct)
adminRoute.get("/edit-product",adminAuth.verifyAdmin,productController.EditProductLoad)
adminRoute.post("/edit-product/:id",upload.any(),productController.updateProduct)
adminRoute.get("/delete-product",adminAuth.verifyAdmin,productController.deleteProduct)
adminRoute.get("/recover-product",adminAuth.verifyAdmin,productController.recoverProduct)

//.................userRoute................................................
adminRoute.get("/users",adminAuth.verifyAdmin,userMangementController.loadUser)
adminRoute.get("/block-user",adminAuth.verifyAdmin,userMangementController.blockUser)
adminRoute.get("/unblock-user",adminAuth.verifyAdmin,userMangementController.unBlockUser)

//.....................orderRoute...........................................
adminRoute.get("/orders",adminAuth.verifyAdmin,orderMangementController.loadOrder)
adminRoute.get("/order/detail/:orderId",adminAuth.verifyAdmin,orderMangementController.loadOrderDetail)
adminRoute.post("/order/detail/:orderId",adminAuth.verifyAdmin,orderMangementController.insertOrderDetail)

//.......................dashboard................................................
adminRoute.get("/dashboard",adminAuth.verifyAdmin,dashboardController.loadDashboard)

module.exports=adminRoute