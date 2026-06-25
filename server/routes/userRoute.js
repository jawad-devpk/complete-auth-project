const express = require("express");
const router = express.Router();
const User = require("../modal/schema");
const signup = require("../controller/usercontroller");

const login = require("../controller/login");
const logout = require("../controller/logout");
const forgetPassword = require("../controller/forgetpass");
const verifyOTP = require("../controller/verifyOTP");
const resetPassword = require("../controller/resetPassword");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.use(auth);

router.post("/logout", logout);

router.get("/dashboard", async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error: " + error.message
        });
    }
});

module.exports = router;
