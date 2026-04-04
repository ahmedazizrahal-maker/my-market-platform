const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // FIX: find vendor by ownerUserId
    const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
    req.vendorId = vendor ? vendor._id : null;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuth };
