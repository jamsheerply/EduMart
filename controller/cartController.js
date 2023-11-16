const cartModel = require("../model/cartModel")
const produdctModel = require("../model/productModel")

const loadShopingCart = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const cartData = await cartModel.findOne({ userId: userId }).populate("items.productId");

        //.....subTotal price....
        let subtotal = cartData.items.reduce((acc, element) => {
            return acc + (element.productId.price * element.quantity);
        }, 0);

        res.render("user/shoppingCart", { cartData: cartData, subtotal: subtotal });
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
const updateShopingCart = async (req, res) => {
    try {
        const { cartId, productId, count } = req.body;
        const cart = await cartModel.findById(cartId)
        // const productID=await produdctModel.findById(productId)
        const existingCartItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingCartItem) {
            existingCartItem.quantity += count;
        }
        cart.totalQuantity += count;
        await cart.save();

        // Calculate subtotal from the updated cart directly
        const cartData = await cartModel.findById(cartId).populate("items.productId");
        let subtotal = cartData.items.reduce((acc, element) => {
            return acc + (element.productId.price * element.quantity);
        }, 0);

        res.json({ subtotal: subtotal })

    } catch (error) {
        console.log(error.message + " updateShopingCart")
    }
}

const deleteShopingCart = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId);
        const productIdToFind = req.params.productId; // Define productIdToFind
        
        const item = cart.items.find(item => item.productId.toString() === productIdToFind);
        if (item) {
            const quantityToRemove = item.quantity;
            await cartModel.updateOne(
                { _id: req.params.cartId },
                {
                    $set: { items: cart.items },
                    $inc: { totalQuantity: -quantityToRemove }
                }
            )
        }
        const result = await cartModel.updateOne(
            { _id: req.params.cartId },
            { $pull: { items: { productId: productIdToFind } } }
        );


        res.redirect("/user/shopping-cart");
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
};


module.exports = {
    loadShopingCart,
    insertTOShopingCart,
    updateShopingCart,
    deleteShopingCart
}