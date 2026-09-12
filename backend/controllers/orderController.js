const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");


// ===============================
// CREATE ORDER
// ===============================

const createOrder = async (req, res) => {
  try {

    const {
      address,
      items,
      totalAmount,
    } = req.body;


    // Get logged-in customer from JWT

    const customer =
      await Customer.findById(req.customer.id);


    if (!customer) {

      return res.status(404).json({
        message: "Customer not found"
      });

    }


    // Check stock before creating order

    for (const item of items) {

      const product =
        await Product.findById(item.productId);


      if (!product) {

        return res.status(404).json({
          message: `Product not found: ${item.name}`
        });

      }


      if (product.stock < item.quantity) {

        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. Available stock: ${product.stock}`
        });

      }

    }


    // Create order

    const order = await Order.create({

      customerId: customer._id,

      customerName: customer.name,

      phone: customer.phone,

      address,

      items,

      totalAmount,

    });


    // Decrease product stock

    for (const item of items) {

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity
          }
        }
      );

    }


    res.status(201).json({

      message: "Order placed successfully",

      order,

    });


  } catch (error) {

    res.status(500).json({

      message: "Failed to place order",

      error: error.message,

    });

  }
};


// ===============================
// GET CUSTOMER ORDERS
// ===============================

const getCustomerOrders = async (req, res) => {

  try {

    const orders = await Order.find({

      customerId: req.customer.id

    }).sort({

      createdAt: -1

    });


    res.status(200).json(orders);


  } catch (error) {

    res.status(500).json({

      message: "Failed to fetch customer orders",

      error: error.message

    });

  }

};


// ===============================
// EXPORT
// ===============================

module.exports = {

  createOrder,
  getCustomerOrders

};