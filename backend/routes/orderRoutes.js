const express = require("express");

const {
    createOrder,
    getCustomerOrders
} = require("../controllers/orderController");

const customerProtect =
    require("../middleware/customerAuthMiddleware");

const router = express.Router();


// Create Order

router.post("/", customerProtect, createOrder);


// Customer Order History

router.get(
    "/my-orders",
    customerProtect,
    getCustomerOrders
);


module.exports = router;