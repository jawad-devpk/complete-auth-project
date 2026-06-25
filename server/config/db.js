const mongoose = require("mongoose");
const dns = require("dns");

// DNS issue fix for MongoDB Atlas SRV connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function ConnectDb() {
    try {
        const mongoUri =
            process.env.MONGODB_URI ||
            process.env.MONGO_URI ||
            process.env.mongo_uri;

        if (!mongoUri) {
            throw new Error("MongoDB URI missing. Add MONGODB_URI in .env");
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database is not connected");
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = ConnectDb;