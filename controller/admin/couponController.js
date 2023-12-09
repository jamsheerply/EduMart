const couponModel = require("../../model/couponModel")
const loadCoupon = async (req, res) => {
    try {
        const couponData = await couponModel.find({})
        // console.log(couponData)
        res.render("admin/coupon", { couponData: couponData })
    } catch (error) {
        console.error(error.messaage + " loadCoupon")
    }
}

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
const loadEditCoupon = async (req, res) => {
    try {
        const { couponId } = req.query;
        const couponData = await couponModel.findOne({ _id: couponId });
        // console.log(couponData)
        res.json({ couponData: couponData });
    } catch (error) {
        console.error(error.message + " loadEditCoupon");
        res.status(500).json({ error: 'An error occurred while fetching coupon data' });
    }
};

const insertEditCoupon = async (req, res) => {
    try {
        const { couponId } = req.query; // Assuming the couponId is obtained from the query

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
                { couponName: { $regex: new RegExp('^' + normalizedCouponName + '$', 'i') } },
                { couponCode: { $regex: new RegExp('^' + normalizedCouponCode + '$', 'i') } }
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
                discountPercentage: discountPercentage,
                usageLimit: usageLimit,
                minimumOrderAmount: minimumOrderAmount
            },
            { new: true } // To get the updated document
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

module.exports = {
    loadCoupon,
    insertCoupon,
    loadEditCoupon,
    insertEditCoupon
}