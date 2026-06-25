const User = require('../modal/schema');

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Please provide email and OTP"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Check if OTP exists and matches
        if (!user.resetOTP || user.resetOTP !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (!user.resetOTPExpiry || Date.now() > user.resetOTPExpiry) {
            // Clear expired OTP
            user.resetOTP = undefined;
            user.resetOTPExpiry = undefined;
            await user.save();

            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully. You can now reset your password."
        });

    } catch (error) {
        console.log("OTP verification error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = verifyOTP;