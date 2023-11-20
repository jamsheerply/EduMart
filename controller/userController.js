const userModel = require("../model/userModel");
const otpVerification = require("../model/otpVerification")
const adminModel = require("../model/adminModel")
const productModel = require("../model/productModel")
const orderModel = require("../model/orderModel")
require('dotenv').config();


//............passwordHashing.......................
const bcrypt = require("bcrypt")
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message + " bcrypt")
    }
}

//.................nodeMailer......................
const nodemailer = require("nodemailer");
const { name } = require("ejs");
const cartModel = require("../model/cartModel");
const sendVerifyMail = async (name, email) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_EMAIL,   //need to setup this in your google account
                pass: process.env.SMTP_PASS,
            },
        });
        const mailOptions = {
            from: 'safatedumartpayyoli@gmail.com',
            to: email,
            subject: "for verification mail for safat edumart payyoli",
            html: "<h2>hi " + name + " </h2>" + "<h2>OTP for account verification is </h2>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        }
        await new otpVerification({
            email: email,
            otp: otp,
        }).save();
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                // console.log("email has been sent", info.response)
            }
        })

    } catch (error) {
        console.log(error.message + " sendVerifyMail")
    }
}

//............loadLanding..........................
const loadLanding = async (req, res) => {
    const productData = await productModel.find({ isdeleted: true, status: "published" })
    const biographiesData = await productModel.find({ isdeleted: true, category: "Biographies", status: "published" })
    const crimeAndThrillerData = await productModel.find({ isdeleted: true, category: "Crime and Thriller", status: "published" })
    res.render("user/landing", { product: productData, biographies: biographiesData, crimeAndThriller: crimeAndThrillerData })
}

// ...............loadRegister......................
const loadRegister = async (req, res) => {
    try {
        res.render("user/register");
    } catch (error) {
        console.log(error.message + " loadUser");
    }
};

//.................insertuser..........................
const insertUser = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase()
        const spassword = await securePassword(req.body.password);
        const firstName = req.body.firstName
        const userData = new userModel({
            firstName: firstName,
            lastName: req.body.lastName,
            email: email,
            password: spassword,
            address: []

        });

        if (userData) {
            let exist = await userModel.findOne({ email: email });

            if (exist) {
                return res.json({ err: "User Already Exists" });
            } else {
                sendVerifyMail(firstName, email)
                req.session.userData = userData
                return res.json({ status: true });
            }
        } else {
            console.log("Data insertion in user failed");
        }
    } catch (error) {
        console.log(error.message + " insertUser");
    }
}

//..................loadOtp..........................
const loadOtp = async (req, res) => {
    try {
        res.render("user/otp")
    } catch (error) {
        console.log(error.message + " loadOTp")
    }
}

// ...............verifyOtp............................
const verifyOtp = async (req, res) => {
    try {
        const digitOne = req.body.digitOne;
        const digitTwo = req.body.digitTwo;
        const digitThree = req.body.digitThree;
        const digitFour = req.body.digitFour;
        const strOtp = digitOne + digitTwo + digitThree + digitFour;

        const email = req.session.userData.email;
        let storedOtp = await otpVerification.findOne({ email: email });

        if (strOtp == storedOtp.otp) {
            const userData = req.session.userData;
            const saveData = new userModel(userData);
            await saveData.save();
            req.session.email = userData.email
            req.session.userLogged = true
            req.session.emailVerifyUser = req.session.userData.email
            req.session.save()
            res.redirect("/user/home");
        } else {
            res.render("user/otp", { message: "invalid otp" })
        }
        req.session.userData._id;

    } catch (error) {
        console.log(error.message);
    }
}


//............................resendOtp..................
const resendOtp = async (req, res) => {
    try {
        const email = req.session.userData.email;
        const firstName = req.session.userData.firstName
        let storedOtp = await otpVerification.findOne({ email: email });
        if (!storedOtp) {
            sendVerifyMail(firstName, email)
            res.render("user/otp", { message: "New  otp has been sent to email" })
        }
    } catch (error) {
        console.log(error.message + " resendOtp")
    }
}

// .......................loadHome....................
const loadHome = async (req, res) => {
    try {
        req.session.email = req.session.userData.email


        const productData = await productModel.find({ isdeleted: true, status: "published" })
        const biographiesData = await productModel.find({ isdeleted: true, category: "Biographies", status: "published" })
        const crimeAndThrillerData = await productModel.find({ isdeleted: true, category: "Crime and Thriller", status: "published" })
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("user/home", { product: productData, biographies: biographiesData, crimeAndThriller: crimeAndThrillerData })
    } catch (error) {
        console.log(error.message + "loadHome")
    }
}

//.......................loadLogin...................
const loadLogin = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("user/login")
    } catch (error) {
        console.log(error.message + "loadLogin")
    }
}

//.................verifyLogin......................
const verifyLogin = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        const { email, password } = req.body
        const userData = await userModel.findOne({ email: email, status: 'unblock' })
        const adminData = await adminModel.findOne({ email: email })
        if (userData) {
            const passwordCompare = await bcrypt.compare(password, userData.password)
            if (passwordCompare) {
                req.session.emailVerifyUser = req.body.email
                // console.log(req.session.emailVerifyUser)
                req.session.userLogged = true
                req.session.userData = userData
                res.redirect("/user/home")
            } else {
                res.render("user/login", { message: "Email and password is incorrect" })
            }
        } else if (adminData) {
            if (req.password === adminData.password) {
                // req.session.email= userData.email
                req.session.adminLogged = true
                res.redirect("/admin/product")
            } else {
                res.render("user/login", { message: "Email and password is incorrect" })
            }
        } else {
            res.render("user/login", { message: "User not found" })
        }
    } catch (error) {
        console.log(error.message + " verifyLogin")
    }
}


//..............logOut.......................
const userLogout = async (req, res) => {
    try {
        // console.log("hi")
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message + " userLogout")
    }
}

//................adminInsert.......................
// const adminInsert = async (req, res) => {
//     try {
//         const adminData = new adminModel({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password
//         })
//         adminData.save()
//         if (adminData) {
//             res.send("inserted")
//         }
//     } catch (error) {
//         console.log(error.message + " adiminInsert")
//     }
// }

//..................loadProductList...............................
const loadProductList = async (req, res) => {
    try {
        const productData = await productModel.find({ isdeleted: true })
        res.render("user/productList", { product: productData })
    } catch (error) {
        console.log(error.message + " loadProductList")
    }
}

//...................loadProductDetail..............................
const loadProductDetail = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await productModel.findById(id)
        res.render("user/productDetail", { product: productData })
    } catch (error) {
        console.log(error.message + " loadProductDetails")
    }
}

const loadAddress = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const userData = await userModel.findById(userId)


        res.render("user/address", { userData: userData })

    } catch (error) {
        console.log(error.message + "loadAddress")
    }
}

const loadCheckOut = async (req, res) => {
    try {
        const subtotal = req.session.subtotal;
        const cartData = req.session.cartData;


        req.session.addressId = req.params.addressId
        req.session.save()

        if (!req.session.userData.address) {
            const userId = req.session.userData._id;
            const addresData = await userModel.findById(userId)
        }

        const userData = req.session.userData
        const addressIdToFind = req.params.addressId
        const addressData = userData.address.find(element => element._id.toString() === addressIdToFind);

        res.render("user/checkout", { cartData: cartData, subtotal: subtotal, addressData: addressData })
    } catch (error) {
        console.log(error.message + " loadCheckOut")
    }
}
const insertAddress = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const { firstName, lastName, address, city, state, postCode, email, phone, paymentMethod } = req.body;

        // Checking if user address exists, otherwise save it
        const userData = await userModel.findById(userId);
        const addressIdToFind = req.session.addressId;
        const addressData = userData.address.find(element => element._id.toString() === addressIdToFind);
        if (!addressData) {
            userData.address.push({ firstName, lastName, address, city, state, postCode, email, phone });
            await userData.save();
        }

        // Adding to order model
        const cartId = req.session.cartData._id;
        const cartData = await cartModel.findById(cartId);

        if (cartData) {
            // Define the products  object
            const products = cartData.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // Define the shipping address object
            const shippingAddress = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                state: state,
                postCode: postCode,
                email: email,
                phone: phone
            };
            const orderData = new orderModel({
                userId: req.session.userData._id,
                products: products,
                orderStatus: 'ordered',
                totalAmount: req.session.subtotal,
                shippingAddress: [shippingAddress],
                orderDate: new Date(),
                paymentStatus: 'pending',
                paymentMethod: paymentMethod,
                deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                activity: [{
                    date: new Date(),
                    status: 'ordered'
                }]
            });

            // Save orderData to the database
            const savedOrder = await orderData.save();

            // Check if the order was successfully saved
            if (savedOrder) {
                // Clearing cart after order placement
                await cartModel.updateOne(
                    { _id: req.session.cartData._id },
                    { $set: { items: [], totalQuantity: 0 } }
                );
                return res.json({ status: true });
            }
        }
    } catch (error) {
        console.error(error.message + " insertAddress");
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

module.exports = {
    loadLanding,
    loadRegister,
    insertUser,
    loadOtp,
    verifyOtp,
    resendOtp,
    loadHome,
    loadLogin,
    verifyLogin,
    userLogout,
    // adminInsert,
    loadProductList,
    loadProductDetail,
    loadAddress,
    loadCheckOut,
    insertAddress
};
