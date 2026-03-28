require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const vendorRoutes = require("./routes/vendors");
const productRoutes = require("./routes/products");
const adRoutes = require("./routes/ads");
const checkoutRoutes = require("./routes/checkout");

const app = express();

app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

connectDB();

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/api/debug-token", require("./middleware/auth"), (req, res) => res.json({ userFromToken: req.user }));
//, require("./middleware/auth")

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
