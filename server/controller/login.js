const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../modal/schema");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Wrong email",
            });
        }

        const passmatch = await bcrypt.compare(password, user.password);

        if (!passmatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password",
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is missing",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
            }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
}

module.exports = login;