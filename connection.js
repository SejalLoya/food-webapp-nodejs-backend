const mongoose = require("mongoose");
require("dotenv").config(); // Load .env file

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.CONN_STRING);

        if (mongoose.connection.readyState === 1) {
            console.log("✅ Connected to MongoDB");
        }
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
    }
};

module.exports = connectDb;
