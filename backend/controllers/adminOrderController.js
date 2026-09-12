const Order = require("../models/Order");


// ===============================
// GET ALL ORDERS
// ===============================

const getOrders = async (req, res) => {

    try {

        const orders =
            await Order
                .find()
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            orders
        );


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch orders",

            error:
                error.message

        });

    }

};


// ===============================
// UPDATE ORDER STATUS
// ===============================

const updateOrderStatus = async (req, res) => {

    try {

        const { status } =
            req.body;


        // ===============================
        // ALLOWED STATUSES
        // ===============================

        const allowedStatuses = [

            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid order status"

            });

        }


        // ===============================
        // FIND ORDER
        // ===============================

        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found"

            });

        }


        // ===============================
        // UPDATE STATUS
        // ===============================

        order.status =
            status;


        await order.save();


        // ===============================
        // RESPONSE
        // ===============================

        res.status(200).json({

            message:
                "Order status updated successfully",

            order

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to update order status",

            error:
                error.message

        });

    }

};


module.exports = {

    getOrders,

    updateOrderStatus

};