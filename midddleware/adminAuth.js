const verifyAdmin= async (req, res, next) => {
    try {
        if (req.session.adminLogged) {
            next()
        } else {
            res.redirect("/user/login")
        }
    } catch (error) {
        console.log(error.message+ "isLogin")
    }
    
}
const adminExist= async (req, res, next) => {
    try {
        if (req.session.adminLogged) {
            res.redirect("/admin/dashboard")
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message+ "isLogOut")
    }
   
}
module.exports={
    verifyAdmin,
    adminExist
}