const express=require("express")
const adminRoute=express()
const adminController=require("../controller/adminController")

//middleWare
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

//view engine
adminRoute.set("view engine","ejs")
adminRoute.use(express.static("public"))

adminRoute.get("/category",adminController.loadCategory)
adminRoute.post("/category",adminController.insertCategory)
adminRoute.get("/category/edit-Category/:id",adminController.getEditCategoryId)
adminRoute.post("/category/edit-Category/:id",adminController.editCategory)
adminRoute.get("/category/delete-category",adminController.deleteCategory)
adminRoute.get("/category/recover-category",adminController.recoverCategory)


module.exports=adminRoute