const express=require("express");
const User =require( "../models/adminSchema");
const crypto= require("crypto");
const nodemailer= require("nodemailer");
const bcrypt= require("bcrypt");


// 📌 Forgot Password
const  forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate secure token
        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "antibugger21@gmail.com",
                pass: "nxrwknfyslgkdmlk"
            }
        });

        await transporter.sendMail({
            from: "antibugger21@gmail.com",
            to: email,
            subject: "Password Reset",
            html: `<p>Click here to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetTokenExpiry: { $gt: Date.now() } // still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports={forgotPassword, resetPassword};
