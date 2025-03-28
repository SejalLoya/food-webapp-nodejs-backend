const { signup, login, logout, resetPassword, getUser, verifyOtp } = require("./controllers/AuthController");
const { addToCart, getCart, removeFromCart, incrementQty, decrementQty, checkout, clearCart } = require("./controllers/FeatureController");
const { verifyToken } = require("./middlewares/VerifyTokens");

const router = require("express").Router();


//AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/reset-password", resetPassword);
router.get("/get-user", verifyToken, getUser);
router.put("/verify-otp", verifyOtp);

//FEATURE ROUTES
router.post("/add-to-cart/:id", addToCart);
router.get("/get-cart/:id", getCart);
router.delete("/remove-from-cart/:id", removeFromCart);
router.put("/increment-qty/:id", incrementQty);
router.put("/decrement-qty/:id", decrementQty);
router.get("/checkout", verifyToken, checkout);
router.get("/clear-cart", verifyToken, clearCart);
module.exports = router;