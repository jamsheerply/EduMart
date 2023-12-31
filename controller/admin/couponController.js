const couponModel = require("../../model/couponModel")

//.........................loadCoupon.............................
const loadCoupon = async (req, res) => {
    try {
        const couponData = await couponModel.find({})

        res.render("admin/coupon", { couponData: couponData })
    } catch (error) {
        console.error(error.messaage + " loadCoupon")
    }
}

//..............................addCoupon............................
const insertCoupon = async (req, res) => {
    try {
        const { couponName, couponCode, expiryDate, discountPercentage, usageLimit, minimumOrderAmount } = req.body;

        // Convert couponName and couponCode to lowercase for case-insensitive comparison
        const normalizedCouponName = couponName.toLowerCase();
        const normalizedCouponCode = couponCode.toLowerCase();

        // Check for existing coupons using case-insensitive comparison
        const existingCoupon = await couponModel.findOne({
            $or: [
                { couponName: { $regex: new RegExp('^' + normalizedCouponName + '$', 'i') } },
                { couponCode: { $regex: new RegExp('^' + normalizedCouponCode + '$', 'i') } }
            ]
        });

        if (existingCoupon) {
            return res.json({ error: 'Coupon code or name already exists.' });
        }

        const newCoupon = new couponModel({
            couponName,
            couponCode,
            expiryDate,
            discountPercentage,
            usageLimit,
            minimumOrderAmount
        });

        await newCoupon.save();

        return res.json({ message: 'Coupon created successfully.', status: true });

    } catch (error) {
        console.error(error.message + " insertCoupon");
        res.status(500).json({ error: 'Server error.' });
    }
};

//....................loadEditCoupon...........................
const loadEditCoupon = async (req, res) => {
    try {
        const { couponId } = req.query;
        const couponData = await couponModel.findOne({ _id: couponId });
        res.json({ couponData: couponData });
    } catch (error) {
        console.error(error.message + " loadEditCoupon");
        res.status(500).json({ error: 'An error occurred while fetching coupon data' });
    }
};

//......................insertEditCoupon................................
const insertEditCoupon = async (req, res) => {
    try {
        const { couponId } = req.query;

        const {
            couponName,
            couponCode,
            expiryDate,
            discountPercentage,
            usageLimit,
            minimumOrderAmount
        } = req.body;

        // Convert couponName and couponCode to lowercase for case-insensitive comparison
        const normalizedCouponName = couponName.toLowerCase();
        const normalizedCouponCode = couponCode.toLowerCase();

        // Check for existing coupons using case-insensitive comparison
        const existingCoupon = await couponModel.findOne({
            $or: [
                { couponName: { $regex: new RegExp('^' + normalizedCouponName.replace(/[^\w\s]/gi, '') + '$', 'i') } },
                { couponCode: { $regex: new RegExp('^' + normalizedCouponCode.replace(/[^\w\s]/gi, '') + '$', 'i') } }
            ]
        });
        


        if (existingCoupon && existingCoupon._id.toString() !== couponId) {
            return res.json({ error: 'Coupon code or name already exists.' });
        }

        // Update the coupon
        const updatedCoupon = await couponModel.findByIdAndUpdate(
            couponId,
            {
                couponName: couponName,
                couponCode: couponCode,
                expiryDate: expiryDate,
                status: "active",
                discountPercentage: discountPercentage,
                usageLimit: usageLimit,
                minimumOrderAmount: minimumOrderAmount
            },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ error: 'Coupon not found.' });
        }

        res.json({ message: 'Coupon updated successfully', status: true });
    } catch (error) {
        console.error(error.message + ' insertEditCoupon');
        res.status(500).json({ error: 'Server Error,Coupon code or name already exists' });
    }
};

//...........................deactivateCoupon................................
const deactivateCoupon = async (req, res) => {
    try {
        const { couponId } = req.query;

        const updatedCoupon = await couponModel.findByIdAndUpdate(
            couponId,
            {
                status: "deactive"
            },
            { new: true }
        );

        res.redirect("/admin/coupons")

    } catch (error) {
        console.error(error.messaage + " deactiveCoupon")
    }
}

//......................deactivateCoupon.......................
const checkCouponExpiry = async () => {
    try {
        console.error("checkCouponExpiry")
        // Find all active coupons
        const activeCoupons = await couponModel.find({ status: 'active' });

        // Get the current date
        const currentDate = new Date();

        // Array to hold expired coupon names
        const expiredCouponNames = [];

        // Loop through active coupons to check expiry
        activeCoupons.forEach(async (coupon) => {
            // Compare coupon expiry date with current date
            if (coupon.expiryDate < currentDate) {
                // Expired, update status to 'expired'
                await couponModel.findByIdAndUpdate(coupon._id, { status: 'expired' });
                expiredCouponNames.push(coupon.couponName);
            }
        });

        // Log expired coupon names
        if (expiredCouponNames.length > 0) {
            console.error('Expired Coupon Names:', expiredCouponNames);
        }
    } catch (error) {
        console.error('Error checking coupon expiry:', error);
    }
};

//....................startCouponExpiryCheck.............................
const startCouponExpiryCheck = async () => {
    try {
        // Run the check immediately when the server starts
        await checkCouponExpiry();

        // Schedule the subsequent checks every 6 hours
        setInterval(checkCouponExpiry, 6 * 60 * 60 * 1000); // Run every 6 hours
    } catch (error) {
        console.error('Error starting coupon expiry check:', error);
    }
};

startCouponExpiryCheck();



module.exports = {
    loadCoupon,
    insertCoupon,
    loadEditCoupon,
    insertEditCoupon,
    deactivateCoupon
}