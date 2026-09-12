const express = require("express");

const {
    signupCustomer,
    loginCustomer,
    forgotPassword,
    resetPassword
} = require("../controllers/customerController");

const router = express.Router();


// Customer Sign Up

router.post("/signup", signupCustomer);


// Customer Login

router.post("/login", loginCustomer);
router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);


module.exports = router;