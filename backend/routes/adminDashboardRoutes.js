const express = require("express");

const {
    getDashboardStats,
    getRecentOrders
} = require("../controllers/adminDashboardController");


const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getDashboardStats);
router.get("/recent-orders", protect, getRecentOrders);

module.exports = router;