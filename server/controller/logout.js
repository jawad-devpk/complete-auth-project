async function logout(req, res) {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.log("Logout error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
}

module.exports = logout;