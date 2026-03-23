const mongoose = require("mongoose");

const PriceHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  source: { type: String, default: "local" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceHistory", PriceHistorySchema);