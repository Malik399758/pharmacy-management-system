const Product = require("../models/Product");
const Order = require("../models/Order");


// ===============================
// DASHBOARD STATISTICS
// ===============================

const getDashboardStats = async (req, res) => {

    try {

        const totalProducts =
            await Product.countDocuments();

        const totalOrders =
            await Order.countDocuments();

        const pendingOrders =
            await Order.countDocuments({
                status: "Pending"
            });


        // ===============================
        // TOTAL SALES
        // ===============================

        const salesResult =
            await Order.aggregate([
                {
                    $match: {
                        status: {
                            $in: [
                                "Confirmed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,

                        totalSales: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);


        const totalSales =
            salesResult.length > 0
                ? salesResult[0].totalSales
                : 0;


        // ===============================
        // ONLINE PAID ORDERS
        // ===============================

        const onlinePaidOrders =
            await Order.countDocuments({
                paymentMethod: "ONLINE",
                paymentStatus: "Paid"
            });


        // ===============================
        // COD ORDERS
        // ===============================

        const codOrders =
            await Order.countDocuments({
                paymentMethod: "COD"
            });


        // ===============================
        // PENDING PAYMENTS
        // ===============================

        const pendingPayments =
            await Order.countDocuments({
                paymentStatus: "Pending"
            });


        // ===============================
        // RESPONSE
        // ===============================

        res.status(200).json({

            totalProducts,

            totalOrders,

            pendingOrders,

            totalSales,

            onlinePaidOrders,

            codOrders,

            pendingPayments

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch dashboard stats",

            error:
                error.message

        });

    }

};


// ===============================
// RECENT ORDERS
// ===============================

const getRecentOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()
                .sort({
                    createdAt: -1
                })
                .limit(5);


        res.status(200).json(orders);


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch recent orders",

            error:
                error.message

        });

    }

};


// ===============================
// EXPORT
// ===============================

module.exports = {

    getDashboardStats,

    getRecentOrders

};