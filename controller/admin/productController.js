const categoryModel = require("../../model/categoryModel")
const productModel = require("../../model/productModel")

//...........................loadProduct.........................
const loadProduct = async (req, res) => {
    try {
        const productData = await productModel.find({}).limit(5);
        let productDataCount = await productModel.find({}).count()
        const productPageCount = Math.ceil(productDataCount / 5)

        res.render("admin/product", { product: productData, productPageCount: productPageCount });
    } catch (error) {
        console.error(error.message + " loadProduct");
    }
};

//...........................productPagination..............................
const productPagination = async (req, res) => {
    try {
        const productPageNumber = Number(req.query.productPageCount);
        const productLimitPage = 5;
        const skipDocs = (productPageNumber - 1) * productLimitPage;
        const productData = await productModel
            .find({})
            .skip(skipDocs)
            .limit(productLimitPage);
        res.json({ product: productData, productPageNumber: productPageNumber });
    } catch (error) {
        console.error(error.message + " productPagination");
    }
};

//.........................loadAddProduct......................................
const loadAddProduct = async (req, res) => {
    try {
        const categoryData = await categoryModel.find({})
        res.render("admin/addProduct", { category: categoryData })
    } catch (error) {
        console.error(error.message + "loadAddProduct")
    }
}

//...........................insertAddProduct............................................
const insertAddProduct = async (req, res) => {
    try {
        const productName = req.body.productName;
        const productData = await productModel.find({
            productName: { $regex: new RegExp(productName, 'i') },
        });
        if (productData.length > 0) {
            for (element of productData) {
                const dbProduct = element.productName.toLowerCase();
                const inputproduct = productName.toLowerCase()
                if (dbProduct === inputproduct) {
                    return res.json({ err: "Product already exists." });
                }
            }
        }

        const [file1, file2, file3, file4] = req.files

        const main = "/imageUpload/products/" + file1.filename
        const img1 = "/imageUpload/products/" + file2.filename
        const img2 = "/imageUpload/products/" + file3.filename
        const img3 = "/imageUpload/products/" + file4.filename

        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString();

        const newProduct = new productModel({
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            publisher: req.body.publisher,
            language: req.body.language,
            category: req.body.category,
            productAdded: formattedDate,
            status: req.body.status,
            quantity: req.body.quantity,
            price: req.body.price,
            imageURL: [{
                productImage1: main,
                productImage2: img1,
                productImage3: img2,
                productImage4: img3,
            }]

        })

        await newProduct.save()
        return res.json({ status: true });
    } catch (error) {
        console.error(error.message)
        return res.json({ err: "Product name already exists." });
    }
}

//............................EditProductLoad........................
const EditProductLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const productData = await productModel.findById(id)
        const categoryData = await categoryModel.find({})
        if (productData && categoryData) {
            res.render("admin/editProduct", { product: productData, category: categoryData })
        } else {
            res.redirect("admin/product")
        }
    } catch (error) {
        console.error(error.message + " getEditProductId")
    }
}

//.............................updateProduct.................................
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const productName = req.body.productName;

        const productData = await productModel.find({
            $and: [
                { productName: { $regex: new RegExp(productName, 'i') } },
                { _id: { $ne: id } }
            ]
        });
        if (productData.length > 0) {
            for (element of productData) {
                const dbProduct = element.productName.toLowerCase();
                const inputproduct = productName.toLowerCase()
                if (dbProduct === inputproduct) {
                    return res.json({ err: "Product already exists." });
                }
            }
        }

        await productModel.updateOne({ _id: id }, {
            $set:
            {
                productName: req.body.productName,
                productDescription: req.body.productDescription,
                publisher: req.body.publisher,
                language: req.body.language,
                category: req.body.category,
                status: req.body.status,
                quantity: req.body.quantity,
                price: req.body.price
            }
        })
        if (req.files) {
            const imageFiles = req.files;
            for (const element of imageFiles) {
                if (element.fieldname === "productImage1") {
                    try {
                        const updateQuery = {
                            $set: {
                                "imageURL.0.productImage1": "/imageUpload/products/" + element.filename
                            }
                        };
                        await productModel.updateOne({ _id: id }, updateQuery);
                    } catch (error) {
                        console.error(error.message + " productImage1");
                    }
                } else if (element.fieldname === "productImage2") {
                    try {
                        const updateQuery = {
                            $set: {
                                "imageURL.0.productImage2": "/imageUpload/products/" + element.filename
                            }
                        };
                        await productModel.updateOne({ _id: id }, updateQuery);
                    } catch (error) {
                        console.error(error.message + " productImage2");
                    }
                } else if (element.fieldname === "productImage3") {
                    try {
                        const updateQuery = {
                            $set: {
                                "imageURL.0.productImage3": "/imageUpload/products/" + element.filename
                            }
                        };
                        await productModel.updateOne({ _id: id }, updateQuery);
                    } catch (error) {
                        console.error(error.message + " productImage3");
                    }
                } else if (element.fieldname === "productImage4") {
                    try {
                        const updateQuery = {
                            $set: {
                                "imageURL.0.productImage4": "/imageUpload/products/" + element.filename
                            }
                        };
                        await productModel.updateOne({ _id: id }, updateQuery);
                    } catch (error) {
                        console.error(error.message + " productImage4");
                    }
                }
            }
        }

        return res.json({ status: true })
    } catch (error) {
        console.error(error.message + " updateProduct")
        return res.json({ err: "Product name already exists." });
    }
}

//........................................deleteProduct............................
const deleteProduct = async (req, res) => {
    try {
        const id = req.query.id
        await productModel.updateOne({ _id: id }, {
            $set: {
                isdeleted: false
            }
        })
        res.redirect("/admin/products")
    } catch (error) {
        console.error(error.message + " deleteProduct")
    }
}

//.........................................recoverProduct................................
const recoverProduct = async (req, res) => {
    const id = req.query.id
    await productModel.updateOne({ _id: id }, {
        $set: {
            isdeleted: true
        }
    })
    res.redirect("/admin/products")
}
module.exports = {
    loadProduct,
    productPagination,
    loadAddProduct,
    insertAddProduct,
    EditProductLoad,
    updateProduct,
    deleteProduct,
    recoverProduct
}