const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../modal/schema");

async function forgetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return res.status(500).json({
                success: false,
                message: "Email configuration is missing",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not registered",
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetOTP = otp;
        user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
        });

        await transporter.sendMail({
            from: `"Complete Auth Project" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        console.log("Forgot password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Email could not be sent: " + error.message,
        });
    }
}

module.exports = forgetPassword;