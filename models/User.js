const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Array,
        default: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "food",
        },
    ],
    },
    otp: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("User", UserSchema);