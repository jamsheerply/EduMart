const nodemailer = require("nodemailer");
const userModel = require("../../model/userModel");
const otpModel = require("../../model/otpModel")
const adminModel = require("../../model/adminModel")
const productModel = require("../../model/productModel")
const orderModel = require("../../model/orderModel")
const cartModel = require("../../model/cartModel");
const couponModel = require("../../model/couponModel");
const razorpay = require("razorpay")
require('dotenv').config();
const fs = require('fs');


//............passwordHashing.......................
const bcrypt = require("bcrypt")
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.error(error.message + " bcrypt")
    }
}

//.................nodeMailer......................

const sendVerifyMail = async (name, email) => {
    try {
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
        console.info("Email has been sent:", info.accepted);
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
        console.error(error.message + " loadUser");
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
            console.error("Data insertion in user failed");
        }
    } catch (error) {
        console.error(error.message + " insertUser");
    }
}

//..................loadOtp..........................
const loadOtp = async (req, res) => {
    try {
        res.render("user/otp")
    } catch (error) {
        console.error(error.message + " loadOTp")
    }
}

// ...............verifyOtp............................
const verifyOtp = async (req, res) => {
    try {
        const { digitOne, digitTwo, digitThree, digitFour } = req.body;
        const strOtp = digitOne + digitTwo + digitThree + digitFour;

        // // Input Validation - Checking if OTP is valid
        // if (!strOtp || strOtp.length !== 4 || !/^\d+$/.test(strOtp)) {
        //     return res.render("user/otp", { message: "Invalid OTP format. Please enter a valid OTP." });
        // }

        const email = req.session.userData.email;
        const storedOtp = await otpModel.findOne({ email });

        if (!storedOtp || strOtp != storedOtp.otp) {
            return res.render("user/otp", { message: "Invalid OTP. Please try again." });
        }

        const userData = req.session.userData;
        const saveData = new userModel(userData);
        await saveData.save();

        req.session.email = userData.email;
        req.session.userLogged = true;
        req.session.emailVerifyUser = req.session.userData.email;
        req.session.save();

        if (req.session.referralOffer) {
            const couponData = await couponModel.findOne({ couponCode: "ReferAndEarn" });

            if (couponData) {
                const coupon = couponData.toObject();
                if (!coupon.users) {
                    coupon.users = [];
                }

                const existingUser = coupon.users.find(user => user.userId === req.session.referralUserId);

                if (existingUser) {
                    existingUser.limit += 1;
                } else {
                    coupon.users.push({ userId: req.session.referralUserId, count: 0, limit: 1 });
                }

                await couponModel.findOneAndUpdate(
                    { couponCode: "ReferAndEarn" },
                    { users: coupon.users },
                    { new: true }
                );
            }
            res.redirect("/user/home");
        } else {
            res.redirect("/user/home");
        }
    } catch (error) {
        console.error("Error in verifyOtp:", error.message);
        res.status(500).send("Server Error");
    }
};

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
        console.error(error.message + " resendOtp")
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
        console.error(error.message + "loadHome")
    }
}

//.......................loadLogin...................
const loadLogin = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("user/login")
    } catch (error) {
        console.error(error.message + "loadLogin")
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
        console.error(error.message + " verifyLogin")
    }
}

//..............logOut.......................
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.error(error.message + " userLogout")
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
//         console.error(error.message + " adiminInsert")
//     }
// }

//...................loadProductDetail..............................
const loadProductDetail = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await productModel.findById(id)
        res.render("user/productDetail", { product: productData })
    } catch (error) {
        console.error(error.message + " loadProductDetails")
    }
}

//....................loadAddress..................................
const loadAddress = async (req, res) => {
    try {
        const userId = req.session.userData._id;

        const userData = await userModel.findById(userId)
        req.session.userData = userData
        req.session.save()

        res.render("user/address", { userData: userData })

    } catch (error) {
        console.error(error.message + "loadAddress")
    }
}

//....................loadCheckOut................................
const loadCheckOut = async (req, res) => {
    try {
        const subtotal = req.session.subtotal;

        const grandtotal = req.session.grandtotal;

        const cartData = req.session.cartData;

        req.session.addressId = req.params.addressId;
        req.session.save();

        if (!req.session.userData.address) {
            const userId = req.session.userData._id;
            const addressData = await userModel.findById(userId);
        }

        if (req.session.cartData) {
            const userData = req.session.userData;
            const addressIdToFind = req.params.addressId;
            const addressData = userData.address.find(element => element._id.toString() === addressIdToFind);

            res.render("user/checkout", {
                cartData: cartData,
                subtotal: subtotal,
                addressData: addressData,
                grandtotal: grandtotal,
                discount: req.session.discount ? req.session.discount : 0 // Corrected syntax
            });
        } else {
            res.redirect("/user/home");
        }
    } catch (error) {
        console.error(error.message + " loadCheckOut");
    }
};


//..........inserAdreess and create order............
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
        const cartData = await cartModel.findById(cartId).populate("items.productId");;

        if (cartData) {
            // Define the products  object
            const products = cartData.items.map(item => {
                let itemPrice = item.productId.price;

                if (item.productId.productOffer || item.productId.categoryOffer) {
                    const offerPercentage = Math.max(item.productId.productOffer || 0, item.productId.categoryOffer || 0);
                    const originalPrice = item.productId.price;
                    const discountAmount = (originalPrice * offerPercentage) / 100;
                    itemPrice = originalPrice - discountAmount;
                }

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: itemPrice
                };
            });


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

            const orderDate = new Date();
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7); // Adding 7 days to the current date

            const orderData = new orderModel({
                userId: req.session.userData._id,
                products: products,
                orderStatus: 'ordered',
                totalAmount: req.session.grandtotal,
                shippingAddress: [shippingAddress],
                orderDate: orderDate,
                paymentStatus: 'pending',
                paymentMethod: paymentMethod,
                deliveryDate: deliveryDate,
                activity: [{
                    date: orderDate,
                    status: 'ordered'
                }]
            });


            // Save orderData to the database

            const savedOrder = await orderData.save();

        
            const couponData = await couponModel.findOne({ couponCode: req.session.couponCode, status: "active" });

            // Check if the couponData is valid and the coupon is active
            if (couponData) {
                const coupon = couponData.toObject(); // Convert Mongoose document to JavaScript object

                // If the coupon doesn't have a 'users' array, create an empty one
                if (!coupon.users) {
                    coupon.users = [];
                }

                // Check if the current user exists in the 'users' array
                const existingUser = coupon.users.find(user => user.userId === req.session.userData._id);

                if (existingUser) {
                    // If the user already exists, increment the count
                    existingUser.count += 1;
                } else {
                    // If the user doesn't exist, add them to the 'users' array with a count of 1
                    coupon.users.push({ userId: req.session.userData._id, count: 1 });
                }

                // Save the updated coupon data back to the database
                await couponModel.findOneAndUpdate(
                    { couponCode: req.session.couponCode },
                    { users: coupon.users },
                    { new: true }
                );
            }


            //storing in session in for orderConfirmations
            req.session.discount = 0;
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

//.......................applyCoupon............................................
const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.query;
        req.session.couponCode = couponCode;
        req.session.save();

        if (!req.session.userData || !req.session.subtotal) {
            return res.status(400).json({ error: 'User data or subtotal is missing in the session.' });
        }

        const couponData = await couponModel.findOne({ couponCode: couponCode, status: "active" });

        if (!couponData) {
            return res.status(404).json({ error: 'Coupon not found or inactive.' });
        }

        if (couponCode === "ReferAndEarn") {
            const userCoupon = couponData.users.find(user => user.userId === req.session.userData._id);
            if (userCoupon && userCoupon.count >= userCoupon.limit) {
                return res.status(400).json({ error: 'User has exceeded the usage limit for this coupon.' });
            }
        }

        // Check if subtotal meets the minimum order amount required for the coupon
        if (req.session.subtotal < couponData.minimumOrderAmount) {
            return res.status(400).json({ error: 'Subtotal does not meet the minimum requirement for this coupon.' });
        }

        // Check usage limit of the user for the coupon
        const userCoupon = couponData.users.find(user => user.userId === req.session.userData._id);
        if (userCoupon && userCoupon.count >= couponData.usageLimit) {
            return res.status(400).json({ error: 'User has exceeded the usage limit for this coupon.' });
        }

        // Reset session variables before applying the coupon
        req.session.discount = 0;
        req.session.grandtotal = req.session.subtotal;

        // Calculate the discount and update session variables
        req.session.discount = req.session.grandtotal * (couponData.discountPercentage / 100);
        req.session.grandtotal = req.session.subtotal - req.session.discount;

        // Send a success response back to the client
        res.status(200).json({ message: 'Coupon applied successfully.', discount: req.session.discount, grandtotal: req.session.grandtotal });
    } catch (error) {
        console.error(error.message + " applyCoupon");
        res.status(500).json({ error: 'Server Error' });
    }
};

const generateRazorpay = async (req, res) => {
    try {
        const userId = req.session.userData._id;
        const amount = req.session.grandtotal;

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
        console.error(error.message + " generateRazorpay");
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
        console.error(error.message + " verifyRazorpayPayment");
        res.status(500).json({ status: false, message: "Error in verifying Razorpay payment" });
    }
};



const loadMyProfile = async (req, res) => {
    try {
        const userData = await userModel.findById(req.session.userData._id)
        const couponData = await couponModel.find({ status: "active" })
        res.render("user/myProfile", { userData: userData, couponData })
    } catch (error) {
        console.error(error.message)
    }
}
const insertMyProfile = async (req, res) => {
    try {
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
            { new: true }
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
                { new: true }
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

const uploadProfileImage = async (req, res) => {
    try {
        const { filename } = req.file;
        const profileImageUrl = "/imageUpload/products/" + filename;
        const userId = req.session.userData._id;

        const userData = await userModel.findById(userId)
        const oldImageUrl = `public${userData.profileImageUrl}`;

        const updateProfileImage = await userModel.findByIdAndUpdate(
            userId,
            { profileImageUrl: profileImageUrl },
            { new: true }
        );

        if (oldImageUrl != "publicundefined") {
            fs.unlink(oldImageUrl, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('File unlink error:', unlinkErr);
                    // Handle error if unlinking fails
                    res.status(500).send('Error deleting old profile image');
                } else {
                    console.error('File deleted successfully');
                    // Additional logic or response if needed
                    res.status(200).send('Profile image updated successfully');
                }
            });
        } else {
            console.error("no image")
        }
    } catch (error) {
        console.error(error.message + " uploadProfileImage");
        res.status(500).send('Error uploading profile image'); // Handle other errors
    }
};


const referralOffer = async (req, res) => {
    try {
        const { userId } = req.query
        req.session.referralOffer = true
        req.session.referralUserId = userId
        res.redirect("/user/register")
    } catch (error) {
        console.error(error.message + " referralOffer")
    }
}
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
    loadProductDetail,
    loadAddress,
    loadCheckOut,
    insertAddress,

    //coupon
    applyCoupon,

    //rezorpay
    verifyRazorpayPayment,
    generateRazorpay,

    //myProfile
    loadMyProfile,
    insertMyProfile,
    uploadProfileImage,

    //referral
    referralOffer

};
