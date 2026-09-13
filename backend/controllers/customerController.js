const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// ===============================
// CUSTOMER SIGNUP
// ===============================

const signupCustomer = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        const existingCustomer =
            await Customer.findOne({ email });


        if (existingCustomer) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const customer =
            await Customer.create({

                name,
                email,
                phone,
                password: hashedPassword

            });


        const token =
            jwt.sign(
                {
                    id: customer._id,
                    email: customer.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }
            );


        res.status(201).json({

            message:
                "Customer signup successful",

            token,

            customer: {

                id: customer._id,

                name: customer.name,

                email: customer.email,

                phone: customer.phone

            }

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Customer signup failed",

            error:
                error.message

        });

    }
};



// ===============================
// CUSTOMER LOGIN
// ===============================

const loginCustomer = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const customer =
            await Customer.findOne({ email });


        if (!customer) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                customer.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        const token =
            jwt.sign(
                {
                    id: customer._id,
                    email: customer.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }
            );


        res.status(200).json({

            message:
                "Customer login successful",

            token,

            customer: {

                id: customer._id,

                name: customer.name,

                email: customer.email,

                phone: customer.phone

            }

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Customer login failed",

            error:
                error.message

        });

    }

};



// ===============================
// FORGOT PASSWORD
// ===============================

const forgotPassword = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        // Find customer

        const customer =
            await Customer.findOne({
                email
            });


        if (!customer) {

            return res.status(404).json({

                message:
                    "No customer found with this email"

            });

        }


        // Generate random reset token

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // Save token temporarily

        customer.resetPasswordToken =
            resetToken;


        // Token expires after 15 minutes

        customer.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;


        await customer.save();


        console.log(
            "Password Reset Token:",
            resetToken
        );


        res.status(200).json({

            message:
                "Password reset request successful",

            resetToken

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Forgot password failed",

            error:
                error.message

        });

    }

};

// ===============================
// RESET PASSWORD
// ===============================

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;

        const { password } = req.body;


        // Check password

        if (!password || password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must contain at least 6 characters"
            });

        }


        // Find customer using reset token

        const customer =
            await Customer.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: {
                    $gt: Date.now()
                }
            });


        // Token invalid or expired

        if (!customer) {

            return res.status(400).json({
                message:
                    "Invalid or expired reset token"
            });

        }


        // Hash new password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Update password

        customer.password =
            hashedPassword;


        // Remove reset token

        customer.resetPasswordToken =
            undefined;

        customer.resetPasswordExpire =
            undefined;


        await customer.save();


        res.status(200).json({

            message:
                "Password reset successful"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Password reset failed",

            error:
                error.message

        });

    }

};

// ===============================
// GET CUSTOMER PROFILE
// ===============================

const getCustomerProfile = async (req, res) => {

    try {

        const customer =
            await Customer.findById(
                req.customer.id
            ).select(
                "-password -resetPasswordToken -resetPasswordExpire"
            );


        if (!customer) {

            return res.status(404).json({

                message:
                    "Customer not found"

            });

        }


        res.status(200).json({

            customer

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch customer profile",

            error:
                error.message

        });

    }

};

const updateCustomerProfile = async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {

            return res.status(400).json({
                message: "Name and phone are required"
            });

        }

        const customer =
            await Customer.findById(
                req.customer.id
            );

        if (!customer) {

            return res.status(404).json({
                message: "Customer not found"
            });

        }

        customer.name = name;
        customer.phone = phone;

        await customer.save();

        res.status(200).json({

            message:
                "Profile updated successfully",

            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            }

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to update profile",

            error:
                error.message

        });

    }

};

const changeCustomerPassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        // Check required fields
        if (!currentPassword || !newPassword) {

            return res.status(400).json({

                message:
                    "Current password and new password are required"

            });

        }


        // Find logged-in customer
        const customer =
            await Customer.findById(
                req.customer.id
            );


        if (!customer) {

            return res.status(404).json({

                message:
                    "Customer not found"

            });

        }


        // Check current password
        const isMatch =
            await bcrypt.compare(
                currentPassword,
                customer.password
            );


        if (!isMatch) {

            return res.status(400).json({

                message:
                    "Current password is incorrect"

            });

        }


        // Check new password length
        if (newPassword.length < 6) {

            return res.status(400).json({

                message:
                    "New password must be at least 6 characters"

            });

        }


        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // Save new password
        customer.password =
            hashedPassword;

        await customer.save();


        res.status(200).json({

            message:
                "Password changed successfully"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to change password",

            error:
                error.message

        });

    }

};

// ===============================
// EXPORT
// ===============================
module.exports = {

    signupCustomer,

    loginCustomer,

    forgotPassword,

    resetPassword,

    getCustomerProfile,

    updateCustomerProfile,

    changeCustomerPassword

};