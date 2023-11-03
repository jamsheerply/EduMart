const { compareSync } = require("bcrypt")
const adminModel = require("../model/categoryModel")
const categoryModel = require("../model/categoryModel")
const { render } = require("../routes/adminRoute")


//......................category..................................
const loadCategory = async (req, res) => {
    try {
        const categoryData = await categoryModel.find({})
        // console.log(categoryData)
        res.render("admin/category", { category: categoryData })
    } catch (error) {
        console.log(error.message + " loadcategory")
    }
}
const insertCategory = async (req, res) => {
    try {
        // const categoryData = await categoryModel.find({});
        const categoryName = req.body.categoryName;

        if (!categoryName || categoryName.trim() === "") {
            return res.json({ err: "Category name is required." });
        }

        const up = categoryName.toUpperCase();
        const low = categoryName.toLowerCase();

        // Check if the category (either in uppercase or lowercase) already exists
        const existingCategory = await categoryModel.findOne({ $or: [{ category: up }, { category: low }] });

        if (existingCategory) {
            return res.json({ err: "Category already exists." });
        }

        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString();

        const newCategory = new categoryModel({
            category: categoryName,
            date: formattedDate
        });

        // Save the new category
        await newCategory.save();

        return res.json({ status: "Category added successfully." });
    } catch (error) {
        console.error(error.message);
        return res.json({ err: "An error occurred while adding the category." });
    }
};
const getEditCategoryId = async (req, res) => {
    try {
        const id = req.params.id;
        const categoryData = await categoryModel.findById(id)
        res.json({ categoryData })

    } catch (error) {
        console.log(error.message + " getEditCategoryId")
    }
}
const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const categoryName = req.body.category;
        await categoryModel.updateOne({ _id: id }, {
            $set:
            {
                category: categoryName,
            },
        })
        res.json({ status: true })

    } catch (error) {
        console.log(error.message + " editCategory")
        return res.json({ err: "An error occurred while editing the category." });
    }
}
const deleteCategory = async (req, res) => {
    try {
        const id = req.query.id;
        await categoryModel.updateOne({ _id: id }, {
            $set:
            {
                categorystatus: false
            }
        })
        res.redirect("/admin/category");
    } catch (error) {
        console.log(error.message + " deleteCategory")
    }
}
const recoverCategory = async (req, res) => {
    try {
        const id = req.query.id;
        await categoryModel.updateOne({ _id: id }, {
            $set:
            {
                categorystatus: true
            }
        })
        res.redirect("/admin/category");
    } catch (error) {
        console.log(error.message + " recoverCategory")
    }
}



module.exports = {
//....category......
    loadCategory,
    insertCategory,
    getEditCategoryId,
    editCategory,
    deleteCategory,
    recoverCategory,
}