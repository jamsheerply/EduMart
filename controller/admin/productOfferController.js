const productOfferModel = require("../../model/productOfferModel")
const productModel = require("../../model/productModel")

const loadProductOffer = async (req, res) => {
    try {
        const productData = await productModel.find({ quantity: { $gt: 0 } });
        const productOfferData = await productOfferModel.find({})
        res.render("admin/productOffer", { productOfferData: productOfferData, productData: productData });
    } catch (error) {
        console.error(error.message + " loadProductOffer");
    }
};

const AddProductOffer = async (req, res) => {
    try {
        const {
            productId,
            productName,
            startDate,
            expiryDate,
            discount
        } = req.body;

        const existingProductOffer = await productOfferModel.findOne({ productId: productId })
        if (existingProductOffer) {
            return res.json({ error: 'product already  exists.' });
        }
        const newProductOffer = new productOfferModel({
            productId,
            productName,
            startDate,
            expiryDate,
            discount
        });

        await newProductOffer.save();
        res.status(200).json({ message: 'Product offer added successfully', status: true });
    } catch (error) {
        console.error(error.message + " AddProductOffer");
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loadEditProductOffer = async (req, res) => {
    try {
        const { productOfferId } = req.query;

        if (!productOfferId) {
            return res.status(400).json({ error: 'Product offer ID is missing in the request.' });
        }

        const productOfferData = await productOfferModel.findById(productOfferId);

        if (!productOfferData) {
            return res.status(404).json({ error: 'Product offer not found.' });
        }
        res.json({ productOfferData });
    } catch (error) {
        console.error(error.message + ' loadEditProductOffer');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const insertEditProductOffer = async (req, res) => {
    try {
        let { productOfferId } = req.query
        let {
            productName,
            startDate,
            expiryDate,
            discount } = req.body
        const updateProductOffer = await productOfferModel.findByIdAndUpdate(
            productOfferId,
            {
                startDate: startDate,
                expiryDate: expiryDate,
                discount: discount,
                status: "active"
            }, { new: true }
        );
        res.status(200).json({ status: true });

    } catch (error) {
        console.error(error.message + " insertEditProductOffer")
    }
}
const deactivateProductOffer = async (req, res) => {
    try {
        const { productOfferId } = req.query;
        const updateProductOffer = await productOfferModel.findByIdAndUpdate(
            productOfferId,
            { status: "deactive" }
        );
        res.redirect("/admin/product_offers");
    } catch (error) {
        console.error(error.message + " deactivateProductOffer");
    }
};

const checkProductOfferExpiry = async () => {
    try {
        console.log("checkProductOfferExpiry");

        // Find all active product offers
        const activeProductOffers = await productOfferModel.find({ status: 'active' });

        // Get the current date
        const currentDate = new Date();

        // Array to hold expired product offer names
        const expiredProductOfferNames = [];

        for (const productOffer of activeProductOffers) {
            // Compare product offer expiry date with current date
            const expiryDate = new Date(productOffer.expiryDate);

            if (expiryDate < currentDate) {
                // Expired, update status to 'expired'
                await productOfferModel.findByIdAndUpdate(productOffer._id, { status: 'expired' });
                expiredProductOfferNames.push(productOffer.productName); // Push expired product offer name to the array
            }
        }

        // Log expired product offer names
        if (expiredProductOfferNames.length > 0) {
            console.log('Expired Product Offer Names:', expiredProductOfferNames);
        }
    } catch (error) {
        console.error(error.message + " checkProductOfferExpiry");
    }
};

const startProductOfferExpiryCheck = async () => {
    try {
        // Run the check immediately when the server starts
        await checkProductOfferExpiry();

        // Schedule the subsequent checks every 6 hours
        setInterval(checkProductOfferExpiry, 6 * 60 * 60 * 1000); // Run every 6 hours
    } catch (error) {
        console.error('Error starting product offer expiry check:', error);
    }
};

// Call the function to start the expiration check process when the server starts
startProductOfferExpiryCheck();



module.exports = {
    loadProductOffer,
    AddProductOffer,
    loadEditProductOffer,
    insertEditProductOffer,
    deactivateProductOffer
}