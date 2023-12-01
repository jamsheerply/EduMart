const express = require("express")
const userRoute = express()
const userController = require("../controller/user/userController")
const cartconstroller = require("../controller/user/cartController")
const orderController = require("../controller/user/orderController")
const ProductListController = require("../controller/user/ProductListController")
const userAuth = require("../midddleware/UserAuth")
const adminAuth = require("../midddleware/adminAuth")

//.............middleWare........................
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

//....................view engine......................
userRoute.set('view engine', 'ejs');
userRoute.use(express.static("public"));

//...................userSide..........................................
userRoute.get("/register", userAuth.userExist, userController.loadRegister)
userRoute.post("/register", userController.insertRegister)
userRoute.get("/otp", userAuth.userExist, userController.loadOtp)
userRoute.post("/otp", userController.verifyOtp)
userRoute.get("/resend-otp", userController.resendOtp)
userRoute.get("/home", userAuth.verifyUser, userController.loadHome)
userRoute.get("/login", userAuth.userExist, adminAuth.adminExist, (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    userController.loadLogin(req, res);
});
userRoute.post("/login", userController.verifyLogin)
userRoute.get("/logout", userController.userLogout)

//...................productList.............................
userRoute.get("/product-list", userAuth.verifyUser, ProductListController.loadProductList)
userRoute.get("/product-list/:sortBy/:order", userAuth.verifyUser, ProductListController.productListSort)
userRoute.get("/product-list/filter", userAuth.verifyUser, ProductListController.productListFilter)
userRoute.get("/product-list/pagination", userAuth.verifyUser, ProductListController.productListPagination)
userRoute.get("/product-list/search", userAuth.verifyUser, ProductListController.ProductListSearch)

//...................singleProudct...........................
userRoute.get("/product-detail", userAuth.verifyUser, userController.loadProductDetail)

//...................shopping-cart...........................
userRoute.get("/shopping-cart", userAuth.verifyUser, cartconstroller.loadShopingCart)
userRoute.post("/shopping-cart", userAuth.verifyUser, cartconstroller.insertShopingCart)
userRoute.post("/shopping-cart/update", userAuth.verifyUser, cartconstroller.updateShopingCart)
userRoute.get("/shopping-cart/delete/:cartId/:productId", userAuth.verifyUser, cartconstroller.deleteShopingCart)

//.......................check-out............................
userRoute.get("/address", userAuth.verifyUser, userController.loadAddress)
userRoute.get("/check-out/:addressId", userAuth.verifyUser, userController.loadCheckOut)
userRoute.post("/check-out", userAuth.verifyUser, userController.insertAddress)
userRoute.post('/check-out/generateRazorpayPayment', userController.generateRazorpay)
userRoute.post("/check-out/verifyrazorpaypayment", userAuth.verifyUser, userController.verifyRazorpayPayment)
//...................order........................................
userRoute.get("/order/confirmation", userAuth.verifyUser, orderController.loadOrderConfirmation)
userRoute.get("/order/list", userAuth.verifyUser, orderController.loadOrderList)
userRoute.get("/order/detail/:OrderId", userAuth.verifyUser, orderController.loadOrderDetail)
userRoute.post("/order/detail/:orderId", userAuth.verifyUser, orderController.updateOrderDetail)

//...............userProfile..................................
userRoute.get("/my-profile", userAuth.verifyUser, userController.loadMyProfile)
userRoute.post("/my-profile", userAuth.verifyUser, userController.insertMyProfile)


// userRoute.post("/admin/insert",userController.adminInsert)

module.exports = userRoute
