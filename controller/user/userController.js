const nodemailer = require("nodemailer");
const userModel = require("../../model/userModel");
// const otpVerification = require("../../model/otpVerification")
const otpModel = require("../../model/otpModel")
const adminModel = require("../../model/adminModel")
const productModel = require("../../model/productModel")
const orderModel = require("../../model/orderModel")
const cartModel = require("../../model/cartModel");
const razorpay = require("razorpay")
const moment = require("moment")
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

const sendVerifyMail = async (name, email) => {
    try {
        // console.log(email);
        // console.log(name);
        const otp = Math.floor(1000 + Math.random() * 9000);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: 'safatedumartpayyoli@gmail.com',
            to: email,
            subject: "for verification mail for safat edumart payyoli",
            html: `<h2>hi ${name} </h2><h2>OTP for account verification is </h2><h1 style='font-weight:bold;'>${otp}</h1>`,
        };

        // Save OTP details to your database (assuming 'otpVerification' model)
        await new otpModel({
            email: email,
            otp: otp,
        }).save();

        // Send mail using async/await
        const info = await transporter.sendMail(mailOptions);
        console.log("Email has been sent:", info.accepted);
    } catch (error) {
        console.error("Error in sending verification mail:", error.message);
    }
};

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

//.................insertRegister..........................
const insertRegister = async (req, res) => {
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
        let storedOtp = await otpModel.findOne({ email: email });

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
        let storedOtp = await otpModel.findOne({ email: email });
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
                res.redirect("/admin/dashboard")
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
        const productData = await productModel.find({ isdeleted: true, quantity: { $gt: 0 } }).limit(6);
        const productDataCount = await productModel.find({ isdeleted: true, quantity: { $gt: 0 } }).count();
        const pageCount = Math.ceil(productDataCount / 6)
        res.render("user/productList", { product: productData, pageCount: pageCount });
    } catch (error) {
        console.log(error.message + " loadProductList");
    }
};

const productListSort = async (req, res) => {
    try {
        let sortBy = req.params.sortBy;
        let order = Number(req.params.order);
        const productData = await productModel
            .find({ isdeleted: true, quantity: { $gt: 0 } })
            .sort({ [sortBy]: order }).limit(6);
        res.json({ product: productData });
    } catch (error) {
        console.log(error.message + " productListSort");
    }
};

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
        console.log(error.message + " productListFilter");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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
        console.log(error.message + " productPagination");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const ProductListSearch = async (req, res) => {
    try {
        const productListSearch = req.query.productListSearch;
        const productData = await productModel.find({

            productName: { $regex: new RegExp('^' + productListSearch, 'i') }
        }).limit(6)

        res.json({ product: productData });
    } catch (error) {
        console.log(error.message + " ProductListSearch");
        res.status(500).json({ error: "Internal Server Error" });
    }
};


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
        req.session.userData = userData
        req.session.save()

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
        if (req.session.cartData) {
            const userData = req.session.userData
            const addressIdToFind = req.params.addressId
            const addressData = userData.address.find(element => element._id.toString() === addressIdToFind);

            res.render("user/checkout", { cartData: cartData, subtotal: subtotal, addressData: addressData })
        } else {
            res.redirect("/user/home")
        }

    } catch (error) {
        console.log(error.message + " loadCheckOut")
    }
}

//inserAdreess and create order
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
                orderDate: moment().format('Do MMMM  YYYY, h:mm:ss a'),
                paymentStatus: 'pending',
                paymentMethod: paymentMethod,
                deliveryDate: moment().add(7, 'days').format('Do MMMM YYYY, h:mm:ss a'),
                activity: [{
                    date: new Date(),
                    status: 'ordered'
                }]
            });

            // Save orderData to the database

            const savedOrder = await orderData.save();

            //storing in session in for orderConfirmations
            req.session.orderId = orderData._id
            req.session.shippingAddress = shippingAddress
            req.session.save()

            // Check if the order was successfully saved
            if (savedOrder) {
                // Clearing cart after order placement
                await cartModel.updateOne(
                    { _id: req.session.cartData._id },
                    { $set: { items: [], totalQuantity: 0 } }
                );
                for (const element of products) {
                    try {
                        await productModel.findByIdAndUpdate(
                            element.productId,
                            { $inc: { quantity: -element.quantity } }
                        );
                        // console.log(element.productId + " " + element.quantity);
                    } catch (updateError) {
                        console.error(`Error updating product quantity for ID ${element.productId}: ${updateError.message}`);
                        return res.status(500).json({ error: 'An error occurred while updating product quantities.' });
                    }
                }
                delete req.session.cartData
                return res.json({ status: true });
            }
        }

    } catch (error) {
        console.error(error.message + " insertAddress");
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const generateRazorpay = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const amount = req.session.subtotal;

        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
        });

        const options = {
            amount: amount * 100, // Amount should be in paise
            currency: "INR",
            receipt: userId,
            payment_capture: 1,
        };

        // Creating a Promise wrapper for razorpay.orders.create
        const createOrder = () => {
            return new Promise((resolve, reject) => {
                razorpayInstance.orders.create(options, (error, order) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(order);
                    }
                });
            });
        };

        const order = await createOrder(); // Wait for the order creation

        res.json({ order });
    } catch (error) {
        console.log(error.message + " generateRazorpay");
        return res.status(500).json({ error: "Razorpay order creation error" });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;
        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
        });

        razorpayInstance.payments.fetch(paymentId)
            .then((payment) => {
                if (payment.status === 'captured') {
                    res.json({ status: true });
                } else {
                    res.status(400).json({ status: false, message: "Payment verification failed" });
                }
            })
            .catch((err) => {
                console.error("Razorpay payment verification error:", err);
                res.status(500).json({
                    status: false,
                    message: "An error occurred while verifying the payment: " + err,
                });
            });
    } catch (error) {
        console.log(error.message + " verifyRazorpayPayment");
        res.status(500).json({ status: false, message: "Error in verifying Razorpay payment" });
    }
};



const loadMyProfile = async (req, res) => {
    try {
        const userData = req.session.userData
        res.render("user/myProfile", { userData: userData })
    } catch (error) {
        console.log(error.message)
    }
}
const insertMyProfile = async (req, res) => {
    try {
        console.log(req.body)
        const userId = req.session.userData._id;
        const { firstName, lastName, email, phone, oldPassword, newPassword } = req.body;

        // Update the user's profile directly using findByIdAndUpdate
        const updatedUserData = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone
                }
            },
            { new: true } // To return the updated document
        );

        // Update the session data with the updated user details
        req.session.userData = updatedUserData;
        req.session.save();

        // Change Password Logic
        const passwordCompare = await bcrypt.compare(oldPassword, updatedUserData.password);
        if (passwordCompare) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedUserPassword = await userModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        password: hashedPassword
                    }
                },
                { new: true } // To return the updated document
            );

            req.session.userData = updatedUserPassword;
            req.session.save();
            return res.json({ statusChangePasswordMyProfile: true });
        } else {
            return res.json({ err: "invalid password" })
        }

        // Respond with the updated user data or perform additional actions
        return res.json({ statusEditMyProfile: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error updating profile' });
    }
};


module.exports = {
    loadLanding,
    loadRegister,
    insertRegister,
    loadOtp,
    verifyOtp,
    resendOtp,
    loadHome,
    loadLogin,
    verifyLogin,
    userLogout,
    // adminInsert,
    loadProductList,
    productListSort,
    productListFilter,
    productListPagination,
    ProductListSearch,
    loadProductDetail,
    loadAddress,
    loadCheckOut,
    insertAddress,
    //rezorpay
    verifyRazorpayPayment,
    generateRazorpay,
    //myProfile
    loadMyProfile,
    insertMyProfile
};
