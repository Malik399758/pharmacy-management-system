const jwt = require("jsonwebtoken");

const customerProtect = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message:
                    "Not authorized. Token missing."
            });

        }


        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message:
                    "Not authorized. Token missing."
            });

        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.customer = decoded;


        next();


    } catch (error) {

        return res.status(401).json({
            message:
                "Not authorized. Invalid token."
        });

    }

};


module.exports = customerProtect;