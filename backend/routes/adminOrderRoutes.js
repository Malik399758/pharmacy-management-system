const express = require("express");

const {
    getOrders,
    updateOrderStatus,
} = require("../controllers/adminOrderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);

router.put("/:id", protect, updateOrderStatus);

module.exports = router;