const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);