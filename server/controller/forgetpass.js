const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../modal/schema');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function forgetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "please provide email"
            });
        }

        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return res.status(500).json({
                message: "email configuration is missing"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email not registered"
            });
        }


        const otp = crypto.randomInt(100000, 1000000).toString();
        user.resetOTP = otp;
        // user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOTPExpiry = new Date(Date.now() + 1 * 60 * 1000);

        await user.save();

        const mailOptions = {
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {

            user.resetOTP = undefined;
            user.resetOTPExpiry = undefined;
            await user.save();
            throw error;
        }

        return res.status(200).json({
            message: "OTP sent to your email"
        });
    } catch (error) {
        console.log("forgot password error:", error);
        return res.status(500).json({
            message: "Email could not be sent"
        });
    }
}

module.exports = forgetPassword;
