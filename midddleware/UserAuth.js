const userModel = require("../model/userModel")

const verifyUser = async (req, res, next) => {
    try {
        const email = req.session.emailVerifyUser;
        const userData = await userModel.findOne({ email: email });
        if (userData && req.session.userLogged && userData.status === "unblock") {
            next();
        } else {
            res.redirect("/user/login");
        }
    } catch (error) {
        console.log(error.message + " isLogin");
    }
}

const userExist = async (req, res, next) => {
    try {
        const email = req.session.emailVerifyUser;
        const userData = await userModel.findOne({ email: email });
        if (userData && req.session.userLogged && userData.status === "unblock") {
            res.redirect("/user/home")
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message + "isLogOut")
    }

}
module.exports = {
    verifyUser,
    userExist,

}
