const loadDashboard=async(req,res)=>{
    try {
        res.render("admin/dashboard")
    } catch (error) {
        console.log(error.message+" loadDashboard")
    }
}

module.exports={
    loadDashboard,
}