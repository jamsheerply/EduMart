const userMOdel = require("../../model/userModel")

//......................loadUser.........................
const loadUser = async (req, res) => {
    try {
        const userData = await userMOdel.find({})
        res.render("admin/user", { user: userData })
    } catch (error) {
        console.error(error.message + " loadUser")
    }
}

//.........................blockUser...........................
const blockUser = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await userMOdel.updateOne({ _id: id }, {
            $set: {
                status: "block"
            }
        })
        res.redirect("/admin/users")
    } catch (error) {
        console.error(error.message + " blockUser")
    }
}

//...........................unBlockUser..........................
const unBlockUser = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await userMOdel.updateOne({ _id: id }, {
            $set: {
                status: "unblock"
            }
        })
        res.redirect("/admin/users")
    } catch (error) {
        console.error(error.message + "unBlockUser")
    }
}
module.exports = {
    loadUser,
    blockUser,
    unBlockUser
}