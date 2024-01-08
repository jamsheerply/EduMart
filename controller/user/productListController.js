const productModel = require("../../model/productModel")

//.................................loadProductList............................
const loadProductList = async (req, res) => {
    try {
        const productData = await productModel.find({ isdeleted: true, quantity: { $gt: 0 } }).limit(6);
        const productDataCount = await productModel.find({ isdeleted: true, quantity: { $gt: 0 } }).count();
        const pageCount = Math.ceil(productDataCount / 6)
        res.render("user/productList", { product: productData, pageCount: pageCount });
    } catch (error) {
        console.error(error.message + " loadProductList");
    }
};

//............................productListSort.....................................
const productListSort = async (req, res) => {
    try {
        let sortBy = req.params.sortBy;
        let order = Number(req.params.order);
        const productData = await productModel
            .find({ isdeleted: true, quantity: { $gt: 0 } })
            .sort({ [sortBy]: order }).limit(6);
        res.json({ product: productData });
    } catch (error) {
        console.error(error.message + " productListSort");
    }
};

//.....................................productListFilter............................
const productListFilter = async (req, res) => {
    try {
        const categories = req.query.category ? req.query.category.split(",") : [];
        const prices = req.query.price ? req.query.price.split(",") : [];

        let filterQuery = {};

        if (categories.length > 0) {
            filterQuery.category = { $in: categories };
        }

        if (prices.length > 0) {
            const [minPrice, maxPrice] = prices[0].split('-');
            filterQuery.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        const productData = await productModel
            .find({ ...filterQuery, isdeleted: true, quantity: { $gt: 0 } })
            .limit(6);

        res.json({ product: productData });
    } catch (error) {
        console.error(error.message + " productListFilter");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//............................productListPagination.......................................
const productListPagination = async (req, res) => {
    try {
        const pageNumber = Number(req.query.pageNumber);
        const limitPage = 6;


        const skipDocs = (pageNumber - 1) * limitPage;


        const productData = await productModel
            .find({ isdeleted: true, quantity: { $gt: 0 } })
            .skip(skipDocs)
            .limit(limitPage);


        res.json({ product: productData, pageNumber: pageNumber });
    } catch (error) {
        console.error(error.message + " productPagination");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//.........................ProductListSearch...................................
const ProductListSearch = async (req, res) => {
    try {
        const productListSearch = req.query.productListSearch;
        const productData = await productModel.find({

            productName: { $regex: new RegExp('^' + productListSearch, 'i') }
        }).limit(6)

        res.json({ product: productData });
    } catch (error) {
        console.error(error.message + " ProductListSearch");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports={
    loadProductList,
    productListSort,
    productListFilter,
    productListPagination,
    ProductListSearch,
}
