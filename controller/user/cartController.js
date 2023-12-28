const cartModel = require("../../model/cartModel");
const productModel = require("../../model/productModel");
const produdctModel = require("../../model/productModel")

const loadShopingCart = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const cartData = await cartModel.findOne({ userId: userId }).populate("items.productId");

        if (cartData && cartData.items && cartData.items.length > 0) {
            let subtotal = 0;

            cartData.items.forEach((element) => {
                let itemPrice = element.productId.price;
                if (element.productId.productOffer || element.productId.categoryOffer) {
                    const offerPercentage = Math.max(element.productId.productOffer || 0, element.productId.categoryOffer || 0);
                    const originalPrice = element.productId.price;
                    const discountAmount = (originalPrice * offerPercentage) / 100;
                    itemPrice = originalPrice - discountAmount;
                }
                subtotal += itemPrice * element.quantity;
            });

            res.render("user/shoppingCart", {
                cartData: cartData,
                subtotal: subtotal.toFixed(2),
                grandtotal: subtotal.toFixed(2),
            });

            req.session.subtotal = subtotal.toFixed(2);
            req.session.grandtotal = subtotal.toFixed(2);
            req.session.cartData = cartData;
            req.session.save();
        } else {
            // Handle the case when cartData or cartData.items is null or empty
            res.render("user/shoppingCart", { cartData: null, subtotal: 0 });
        }
    } catch (error) {
        console.error(error.message + " loadShopingCart");
    }
};


const insertShopingCart = async (req, res) => {
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
        console.error(error.message + " insertShopingCart");
    }
};

const updateShopingCart = async (req, res) => {
    try {
        const { cartId, productId, count } = req.body;
        const cart = await cartModel.findById(cartId);

        const existingCartItem = cart.items.find(item => item.productId.toString() === productId);
        const productData = await productModel.findById(productId);

        if (existingCartItem.quantity <= 1 && count === -1) {
            return res.json({ error: "it's not a valid input" });
        } else if (count === -1) {
            if (existingCartItem) {
                existingCartItem.quantity += count;
            }
            cart.totalQuantity += count;
            await cart.save();
        } else if (productData.quantity > existingCartItem.quantity && count === 1) {
            if (existingCartItem) {
                existingCartItem.quantity += count;
            }
            cart.totalQuantity += count;
            await cart.save();
        } else {
            return res.json({ error: "limit exceeded" });
        }

        const userId = req.session.userData._id;
        const cartData = await cartModel.findOne({ userId: userId }).populate("items.productId");

        if (cartData && cartData.items && cartData.items.length > 0) {
            let subtotal = 0;

            cartData.items.forEach((element) => {
                let itemPrice = element.productId.price;
                if (element.productId.productOffer || element.productId.categoryOffer) {
                    const offerPercentage = Math.max(element.productId.productOffer || 0, element.productId.categoryOffer || 0);
                    const originalPrice = element.productId.price;
                    const discountAmount = (originalPrice * offerPercentage) / 100;
                    itemPrice = originalPrice - discountAmount;
                }
                subtotal += itemPrice * element.quantity;
            });

            res.json({
                cartData: cartData,
                subtotal: subtotal,
                grandtotal: subtotal
            });

            req.session.subtotal = subtotal;
            req.session.grandtotal = subtotal;
            req.session.cartData = cartData;
            req.session.cartItemData = cart.items;
            req.session.save();
        }
    } catch (error) {
        console.error(error.message + " updateShopingCart");
        return res.status(500).json({ error: "Internal server error" });
    }
};


const deleteShopingCart = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId);
        const productIdToFind = req.params.productId;

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
    }
};


module.exports = {
    loadShopingCart,
    insertShopingCart,
    updateShopingCart,
    deleteShopingCart
}