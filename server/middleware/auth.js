const jwt = require("jsonwebtoken");

function getTokenFromCookie(cookieHeader) {
    if (!cookieHeader) return ""

    const cookies = cookieHeader.split(";");


    const cookie = cookieHeader.split('; ').find(row => row.startsWith('authToken='));
    if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]);
    }
    return "";

}



const auth = (req, res, next) => {
    const token = req.cookies.authToken;

    console.log("Token received on server:", token); 

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Isme user ki ID hogi
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = auth;