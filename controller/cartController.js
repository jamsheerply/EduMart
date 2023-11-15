const cartModel = require("../model/cartModel")
const produdctModel = require("../model/productModel")

const loadShopingCart = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const cartData = await cartModel.findOne({ userId: userId }).populate("items.productId");
        console.log(cartData.items)// it not showing populated result why
        if (!cartData) {
            return res.render("user/emptyCart", { message: "Your cart is empty" });
        }

        res.render("user/shoppingCart",);
    } catch (error) {
        console.log(error.message + " loadShopingCart");
    }
};

const insertTOShopingCart = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const productId = req.body.productId;

        let cart = await cartModel.findOne({ userId: userId });

        if (!cart) {
            cart = new cartModel({
                items: [],
                totalQuantity: 0,
                userId: userId
            });
        }

        const existingCartItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.items.push({ productId: productId, quantity: 1 });
        }

        cart.totalQuantity += 1;

        await cart.save();
        return res.json({ status: true })
    } catch (error) {
        console.log(error.message + " insertTOShopingCart");
    }
};

module.exports = {
    loadShopingCart,
    insertTOShopingCart
}