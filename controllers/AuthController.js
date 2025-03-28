const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//SIGNUP ROUTE
const signup = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        console.log("➡️ Signup request received:", req.body);

        let user = await User.findOne({ email });
        console.log("🔍 Checking if user exists:", user);

        if (user) {
            return res.status(400).json({ success: false, message: "Please Login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Password hashed successfully");

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log("✅ User created successfully");

        return res.status(200).json({ success: true, message: "Signup Successful" });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


//LOGIN ROUTE
const login = async(req,res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success: false, message: "Please Signup"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success: false, message: "Invalid Password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });
        //for authentication purpose
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).status(200).json({success: true, message: "Login Successful"});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

//LOGOUT ROUTE
const logout = async (req, res) => {
    try {
        res.clearCookie("token"); 
        return res.status(200).json({ success: true, message: "Logged out" }); 
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//GETUSER DETAILS ROUTE
const getUser = async(req,res) => {
    const reqId = req.id;
    try {
        let user = await User.findById(reqId).select("-password");
        if(!user) {
            return res.status(500).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, user, message: "User found"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

//RESET PASSWORD ROUTE
const resetPassword = async(req,res) => {
    const {email} = req.body;
    try {
        const generateOtp = Math.floor(Math.random() * 10000);  //generate 4 digit otp
        let user = User.findOne({email});
        if(!user) {
            return res.status(400).json({success: false, message: "Please Signup"});
        }
        // Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8801239c098e45",
      pass: "7bd29d1d672c24"
    }
  });

  const info = await transporter.sendMail({
    from: 'swiggato@gmail.com',
    to: email,
    subject: "New OTP is generated",
    html: `<h3>Your generated OTP is <i>${generateOtp}</i></h3>`
  })

  if(info.messageId) {
    await User.findOneAndUpdate({email},
    {$set : {
        otp: generateOtp,
    },
  });
  return res.status(200).json({success: true, message: "OTP has been sent successfully"});
}
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

//VERIFY OTP ROUTE
const verifyOtp = async(req,res) => {
    const {otp, newPassword} = req.body;
    try {
        const securedPassword = await bcrypt.hash(newPassword, 10);

        let user = await User.findOneAndUpdate({otp}, {
            $set: {
                password: securedPassword,
                otp: 0,
            },
        });
        if(!user) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }
        return res.status(200).json({success: true, message: "Password updated"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

module.exports = {signup, login, logout, resetPassword, verifyOtp, getUser}