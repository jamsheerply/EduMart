const categoryModel = require("../../model/categoryModel")


//......................category..................................
const loadCategory = async (req, res) => {
    try {
        const categoryData = await categoryModel.find({})
        res.render("admin/category", { category: categoryData })
    } catch (error) {
        console.log(error.message + " loadcategory")
    }
}
const insertCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName;

        const categoryData = await categoryModel.find({ category: { $regex: new RegExp(req.body.category, 'i') } });
        if (categoryData.length > 0) {
            for (element of categoryData) {
                const dbCategory = element.category.toLowerCase();
                const inputCategory = categoryName.toLowerCase()
                if (dbCategory === inputCategory) {
                    return res.json({ err: "Category already exists." });
                }
            }
        }

        if (!categoryName || categoryName.trim() === "") {
            return res.json({ err: "Category name is required." });
        }

        const upCase = categoryName.toUpperCase();
        const lowCase = categoryName.toLowerCase();

        const existingCategory = await categoryModel.findOne({ $or: [{ category: upCase }, { category: lowCase }] });

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

        await newCategory.save();

        return res.json({ status: "Category added successfully." });
    } catch (error) {
        console.error(error.message);
        return res.json({ err: "Category already exists." });
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

        const categoryData = await categoryModel.find({ category: { $regex: new RegExp(req.body.category, 'i') } });
        if (categoryData.length > 0) {
            for (element of categoryData) {
                const dbCategory = element.category.toLowerCase();
                const inputCategory = categoryName.toLowerCase()
                if (dbCategory === inputCategory) {
                    return res.json({ err: "Category already exists." });
                }
            }
        }

        await categoryModel.updateOne({ _id: id }, {
            $set:
            {
                category: categoryName,
            },
        })
        return res.json({ status: true })

    } catch (error) {
        console.log(error.message + " editCategory")
        return res.json({ err: "Category already exists." });
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