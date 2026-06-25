// async function logout(req, res) {
//     try {
//         res.clearCookie("authToken", {
//             httpOnly: true,
//             sameSite: "lax",
//             secure: false,
//             path: "/"
//         });

//         return res.status(200).json({
//             message: "logout successful"
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "server error:" + error.message
//         });
//     }
// }

// module.exports = logout;
async function logout(req, res) {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
}

module.exports = logout;