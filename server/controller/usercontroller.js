
const User = require('../modal/schema');

const bcrypt = require('bcrypt');

//signup
async function signup(req, res) {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "please provide every details properly"
            });
        }


        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                message: "email already exists"
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashPassword
        });
        res.status(201).json({
            message: "signup successful"
        });

    } catch (error) {
        console.error("signup error", error);
        res.status(500).json({
            message: "server error:" + error.message
        });
    }
}

module.exports = signup;
