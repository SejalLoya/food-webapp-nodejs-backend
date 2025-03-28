const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        price: Number,
        totalPrice: Number,
        quantity: Number,
        rating: Number,
        image: String,
        userId: String,
    },
    { timestamps: true }
);

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
