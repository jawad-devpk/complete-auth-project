
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../modal/schema");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "please provide email and password"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "wrong email"
            });
        }

        const passmatch = await bcrypt.compare(password, user.password);
        if (!passmatch) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret is missing"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });


        return res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        console.log("login error:", error);
        return res.status(500).json({
            message: "server error: " + error.message
        });
    }
}

module.exports = login;