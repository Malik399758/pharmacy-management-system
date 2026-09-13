const express = require("express");

const {
    signupCustomer,
    loginCustomer,
    forgotPassword,
    resetPassword,
    getCustomerProfile,
    updateCustomerProfile,
    changeCustomerPassword
} = require("../controllers/customerController");

const customerProtect =
    require("../middleware/customerAuthMiddleware");

const router = express.Router();


// Customer Sign Up

router.post("/signup", signupCustomer);



// Customer Login

router.post("/login", loginCustomer);
router.post(
    "/forgot-password",
    forgotPassword
);

router.get(
    "/profile",
    customerProtect,
    getCustomerProfile
);

router.put(
    "/profile",
    customerProtect,
    updateCustomerProfile
);

router.put(
    "/change-password",
    customerProtect,
    changeCustomerPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);


module.exports = router;