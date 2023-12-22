const categoryModel = require("../../model/categoryModel")
const categoryOfferModel = require("../../model/categoryOfferModel")

const loadCategoryOffer = async (req, res) => {
    try {
        const categoryOfferData = await categoryOfferModel.find({})
        const categoryData = await categoryModel.find({})
        res.render("admin/categoryOffer", { categoryOfferData: categoryOfferData, categoryData: categoryData })
    } catch (error) {
        console.error(error.message + " loadCategoryOffer")
    }
}

const insertAddCategoryOffer = async (req, res) => {
    try {
        const {
            categoryId,
            categoryName,
            startDate,
            expiryDate,
            discount
        } = req.body

        const existingCategoryOffer = await categoryOfferModel.findOne({ categoryId: categoryId })
        if (existingCategoryOffer) {
            return res.json({ error: 'category already  exists.' });
        }
        const newCategoryOffer = new categoryOfferModel({
            categoryId,
            categoryName,
            startDate,
            expiryDate,
            discount
        });

        await newCategoryOffer.save();
        res.status(200).json({ status: true });
    } catch (error) {
        console.error(error.message + " insertAddCategoryOffer")
    }
}

const loadEditCategoryOffer = async (req, res) => {
    try {
        const { categoryOfferId } = req.query
        const categoryOfferData = await categoryOfferModel.findById(categoryOfferId)
        res.json({ categoryOfferData })
    } catch (error) {
        console.error(error.message + " loadEditCategoryOffer")
    }
}

const insertEditCategoryOffer = async (req, res) => {
    try {
        const { categoryOfferId } = req.query
        const {
            categoryName,
            startDate,
            expiryDate,
            discount
        } = req.body
        const updateCategoryOffer = await categoryOfferModel.findByIdAndUpdate(
            categoryOfferId,
            {
                startDate: startDate,
                expiryDate: expiryDate,
                discount: discount,
                status: "active"
            }, { new: true }
        );
        res.status(200).json({ status: true });

    } catch (error) {
        console.error(error.message + " insertEditCategoryOffer")
    }
}

const deactivateCategoryOffer = async (req, res) => {
    try {
        const { categoryOfferId } = req.query
        const deactivateCategoryOffer = await categoryOfferModel.findByIdAndUpdate(
            categoryOfferId,
            { status: "deactivated" }
        )
        res.redirect("/admin/category_offers")
    } catch (error) {
        console.error(error.message + " deactivateCategoryOffer")
    }
}

const checkCategoryOfferExpiry = async () => {
    try {
        console.log("checkCategoryOfferExpiry");

        // Find all active category offers
        const activeCategoryOffers = await categoryOfferModel.find({ status: 'active' });

        // Get the current date
        const currentDate = new Date();

        // Array to hold expired category offer names
        const expiredCategoryOfferNames = [];

        for (const categoryOffer of activeCategoryOffers) {
            // Compare category offer expiry date with current date
            const expiryDate = new Date(categoryOffer.expiryDate);

            if (expiryDate < currentDate) {
                // Expired, update status to 'expired'
                await categoryOfferModel.findByIdAndUpdate(categoryOffer._id, { status: 'expired' });
                expiredCategoryOfferNames.push(categoryOffer.categoryName); // Push expired category offer name to the array
            }
        }

        // Log expired category offer names
        if (expiredCategoryOfferNames.length > 0) {
            console.log('Expired Category Offer Names:', expiredCategoryOfferNames);
        }
    } catch (error) {
        console.error(error.message + " checkCategoryOfferExpiry");
    }
};

const startCategoryOfferExpiryCheck = async () => {
    try {
        // Run the check immediately when the server starts
        await checkCategoryOfferExpiry();

        // Schedule the subsequent checks every 6 hours
        setInterval(checkCategoryOfferExpiry, 6 * 60 * 60 * 1000); // Run every 6 hours
    } catch (error) {
        console.error('Error starting category offer expiry check:', error);
    }
};

// Call the function to start the expiration check process when the server starts
startCategoryOfferExpiryCheck();


module.exports = {
    loadCategoryOffer,
    insertAddCategoryOffer,
    loadEditCategoryOffer,
    insertEditCategoryOffer,
    deactivateCategoryOffer
}