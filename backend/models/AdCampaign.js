const mongoose = require("mongoose");

const AdCampaignSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  budget: { type: Number, required: true }, // in cents
  cpc: { type: Number, required: true },    // cost per click
  status: { type: String, enum: ["active", "paused", "ended"], default: "active" },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("AdCampaign", AdCampaignSchema);