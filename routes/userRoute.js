const express = require("express")
const userRoute = express()
const userController = require("../controller/userController")
const userAuth=require("../midddleware/UserAuth")
// const morgan=require("morgan")

//middleWare
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));
// userRoute.use(morgan("tiny"))

// const path = require("path")
// const multer = require("multer")
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, "../public/userImage"))
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + "-" + file.originalname
//         cb(null, name)
//     }
// })
// const upload=multer({storage:storage})

userRoute.set('view engine', 'ejs');
userRoute.use(express.static("public"));

userRoute.get("/register",userAuth.isLogOut,userController.loadRegister)
userRoute.post("/register",userController.insertUser)
userRoute.get("/otp",userAuth.isLogOut,userController.loadOtp)
userRoute.post("/otp",userController.verifyOtp)
userRoute.get("/home",userAuth.isLogin,userController.loadHome)
userRoute.get("/login", userAuth.isLogOut, (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    userController.loadLogin(req, res);
});
userRoute.post("/login",userController.verifyLogin)
userRoute.get("/logout",userAuth.isLogin,(req, res) => {
    res.setHeader("Cache-Control", "no-store");
    userController.userLogout(req, res);
})

//...................productList..........................
userRoute.get("/product-list",userController.loadProductList)

//...................singleProudct.......................
userRoute.get("/product-detail",userController.loadProductDetail)



userRoute.post("/admin/insert",userController.adminInsert)

module.exports = userRoute
