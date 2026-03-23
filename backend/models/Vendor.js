const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  logo: String,
  theme: String,
}, { timestamps: true });

module.exports = mongoose.model("Vendor", VendorSchema);