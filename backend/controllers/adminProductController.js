const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {

        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


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

const updateProduct = async (req, res) => {
    try {

        const {
            name,
            price,
            category,
            description,
            stock
        } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price,
                category,
                description,
                stock
            },
            {
                new: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
};