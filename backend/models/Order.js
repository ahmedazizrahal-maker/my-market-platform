const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  userEmail: String,
  amount: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);