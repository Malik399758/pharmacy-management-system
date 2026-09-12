const Product = require("../models/Product");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ===============================
// ADD PRODUCT
// ===============================

const addProduct = async (req, res) => {

    try {

        const {
            name,
            price,
            category,
            description,
            stock
        } = req.body;


        const product = await Product.create({

            name,
            price,
            category,
            description,
            stock

        });


        res.status(201).json({

            message: "Product added successfully",

            product

        });

    } catch (error) {

        res.status(500).json({

            message: "Failed to add product",

            error: error.message

        });

    }

};


// ===============================
// ADMIN LOGIN
// ===============================

const loginAdmin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const admin = await Admin.findOne({
            email
        });


        if (!admin) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        // ===============================
        // CREATE JWT TOKEN
        // ===============================

        const token = jwt.sign(

            {
                id: admin._id,
                email: admin.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // ===============================
        // LOGIN RESPONSE
        // ===============================

        res.status(200).json({

            message: "Admin login successful",

            token,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email

            }

        });


    } catch (error) {

        res.status(500).json({

            message: "Admin login failed",

            error: error.message

        });

    }

};


// ===============================
// EXPORT
// ===============================

module.exports = {

    addProduct,
    loginAdmin

};