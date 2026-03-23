const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  title: { type: String, required: true },
  description: String,
  images: [String],
  basePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  sku: { type: String, index: true }, // used for comparison
  category: String,
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);