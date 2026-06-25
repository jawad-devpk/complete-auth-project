// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();
// const ConnectDb = require("./config/db");
// const userRoute = require("./routes/userRoute");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "http://127.0.0.1:5173",
// //   "http://localhost:5174",
// //   process.env.CLIENT_URL,
// // ].filter(Boolean);

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       // Postman / server-to-server / same-origin requests allow
// //       if (!origin) return callback(null, true);

// //       if (allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       }

// //       return callback(new Error("Not allowed by CORS"));
// //     },
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );


// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   "http://localhost:5174",
//   "https://complete-auth-project.vercel.app",
//   process.env.CLIENT_URL,
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("Blocked by CORS:", origin);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.options("*", cors());


// ConnectDb();

// // Routes
// app.use("/api", userRoute);

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Server is running" });
// });

// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const ConnectDb = require("./config/db");
const userRoute = require("./routes/userRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "https://complete-auth-project.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

ConnectDb();

app.use("/api", userRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});