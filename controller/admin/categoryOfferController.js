const categoryModel = require("../../model/categoryModel")
const categoryOfferModel = require("../../model/categoryOfferModel")
const productModel = require("../../model/productModel")

//..................loadCategoryOffer...........................
const loadCategoryOffer = async (req, res) => {
    try {
        const categoryOfferData = await categoryOfferModel.find({})
        const categoryData = await categoryModel.find({})
        res.render("admin/categoryOffer", { categoryOfferData: categoryOfferData, categoryData: categoryData })
    } catch (error) {
        console.error(error.message + " loadCategoryOffer")
    }
}

//........................addCategoryOffer.............................
const insertAddCategoryOffer = async (req, res) => {
    try {
        const {
            categoryId,
            categoryName,
            startDate,
            expiryDate,
            discount
        } = req.body;

        const existingCategoryOffer = await categoryOfferModel.findOne({ categoryId: categoryId });
        if (existingCategoryOffer) {
            return res.status(400).json({ error: 'Category offer already exists.' });
        }

        const newCategoryOffer = new categoryOfferModel({
            categoryId,
            categoryName,
            startDate,
            expiryDate,
            discount
        });

        await newCategoryOffer.save();

        // Update products with the new category offer discount
        await productModel.updateMany({ category: categoryName }, { $set: { categoryOffer: discount } });

        res.status(200).json({ status: true });
    } catch (error) {
        console.error(error.message + " insertAddCategoryOffer");
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//................................loadEditCategoryOffer.....................................
const loadEditCategoryOffer = async (req, res) => {
    try {
        const { categoryOfferId } = req.query
        const categoryOfferData = await categoryOfferModel.findById(categoryOfferId)
        res.json({ categoryOfferData })
    } catch (error) {
        console.error(error.message + " loadEditCategoryOffer")
    }
}

//...........................editCategoryOffer...............................................
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
        await productModel.updateMany({ category: categoryName }, { $set: { categoryOffer: discount } });
        res.status(200).json({ status: true });

    } catch (error) {
        console.error(error.message + " insertEditCategoryOffer")
    }
}

//.....................deactivateCategoryOffer................................
const deactivateCategoryOffer = async (req, res) => {
    try {
        const { categoryOfferId,categoryName } = req.query
        const deactivateCategoryOffer = await categoryOfferModel.findByIdAndUpdate(
            categoryOfferId,
            { status: "deactivated" }
        )
        await productModel.updateMany({ category: categoryName }, { $unset: { categoryOffer: 1 } });
        res.redirect("/admin/category_offers")
    } catch (error) {
        console.error(error.message + " deactivateCategoryOffer")
    }
}

//..............................checkCategoryOfferExpiry................................................
const checkCategoryOfferExpiry = async () => {
    try {
        console.error("checkCategoryOfferExpiry");

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

                await productModel.updateMany({ category: categoryOffer.categoryName }, { $unset: { categoryOffer: 1 } });
                
                expiredCategoryOfferNames.push(categoryOffer.categoryName); // Push expired category offer name to the array
            }
        }

        // Log expired category offer names
        if (expiredCategoryOfferNames.length > 0) {
            console.error('Expired Category Offer Names:', expiredCategoryOfferNames);
        }
    } catch (error) {
        console.error(error.message + " checkCategoryOfferExpiry");
    }
};

//.......................startCategoryOfferExpiryCheck.................................
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