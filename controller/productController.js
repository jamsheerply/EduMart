const categoryModel = require("../model/categoryModel")
const productModel = require("../model/productModel")

const loadProduct = async (req, res) => {
    try {
        const productData = await productModel.find({})
        // console.log(productData)
        res.render("admin/product", { product: productData })
    } catch (error) {
        console.log(error.message + " loadProduct")
    }
}
const loadAddProduct = async (req, res) => {
    try {
        const categoryData = await categoryModel.find({})
        // console.log(categoryData)
        res.render("admin/addProduct", { category: categoryData })
    } catch (error) {
        console.log(error.message + "loadAddProduct")
    }
}
const insertAddProduct = async (req, res) => {
    try {
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
        console.log(error.message)
        return res.json({ err: "Product name already exists." });
    }
}

const EditProductLoad = async (req, res) => {
    try {
        const id = req.query.id;
        // console.log(id)
        const productData = await productModel.findById(id)
        const categoryData = await categoryModel.find({})
        // console.log(productData)
        if (productData && categoryData) {
            res.render("admin/editProduct", { product: productData, category: categoryData })
        } else {
            res.redirect("admin/product")
        }
    } catch (error) {
        console.log(error.message + " getEditProductId")
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id)
        const productData = await productModel.findById({ _id: id })
        // console.log(req.body)
        console.log(req.files)
        await productModel.updateOne({ _id: id }, {
            $set:
            {
                productName: req.body.productName,
                productDescription: req.body.productDescription,
                publisher: req.body.publisher,
                language: req.body.language,
                category: req.body.category,
                status: req.body.status,
                price: req.body.price
            }
        })
        if (req.files) {
            const imageFiles = req.files;
            for (const element of imageFiles) {
                //   console.log(element.fieldname);
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
        console.log(error.message + " updateProduct")
        return res.json({ err: "Product name already exists." });
    }
}
const deleteProduct=async(req,res)=>{
    try {
        const id=req.query.id
        // console.log(id)
        await productModel.updateOne({_id:id},{
            $set:{
                isdeleted:false
            }
        })
        res.redirect("/admin/product")
    } catch (error) {
        console.log(error.message+ " deleteProduct")
    }
}
const recoverProduct=async(req,res)=>{
    const id=req.query.id
    // console.log(id)
    await productModel.updateOne({_id:id},{
        $set:{
            isdeleted:true
        }
    })
    res.redirect("/admin/product")
}
module.exports = {
    loadProduct,
    loadAddProduct,
    insertAddProduct,
    EditProductLoad,
    updateProduct,
    deleteProduct,
    recoverProduct

}