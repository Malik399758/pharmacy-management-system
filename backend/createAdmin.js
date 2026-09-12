const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

require("dotenv").config();


const createAdmin = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        const hashedPassword =
            await bcrypt.hash(
                "admin123",
                10
            );


        const admin = await Admin.create({

            name: "Pharmacy Admin",

            email: "admin@pharmacy.com",

            password: hashedPassword

        });


        console.log(
            "Admin created successfully!"
        );

        console.log(
            "Email:",
            admin.email
        );

        console.log(
            "Password: admin123"
        );


        process.exit();

    } catch (error) {

        console.error(
            "Failed to create admin:",
            error.message
        );

        process.exit(1);

    }

};


createAdmin();