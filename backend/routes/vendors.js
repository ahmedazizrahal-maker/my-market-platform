const express = require("express");
const Vendor = require("../models/Vendor");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Create vendor profile for current user
router.post("/", requireAuth, async (req, res) => {
  const { name, slug, logo, theme } = req.body;
  try {
    const existing = await Vendor.findOne({ slug });
    if (existing) return res.status(400).json({ error: "Slug already taken" });

    const vendor = await Vendor.create({
      ownerUserId: req.user._id,
      name,
      slug,
      logo,
      theme,
    });

    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: get vendor storefront
router.get("/:slug", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ slug: req.params.slug });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;