const express = require("express");
const AdCampaign = require("../models/AdCampaign");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Vendor: create ad campaign for a product
router.post("/", requireAuth, async (req, res) => {
  const { productId, name, budget, cpc } = req.body;
  try {
    const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
    if (!vendor) return res.status(403).json({ error: "Not a vendor" });

    const product = await Product.findOne({ _id: productId, vendorId: vendor._id });
    if (!product) return res.status(400).json({ error: "Invalid product" });

    const ad = await AdCampaign.create({
      vendorId: vendor._id,
      productId,
      name,
      budget,
      cpc,
    });

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: get sponsored products for a query
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const ads = await AdCampaign.find({ status: "active", budget: { $gt: 0 } })
      .populate({
        path: "productId",
        match: q ? { title: new RegExp(q, "i") } : {},
        populate: { path: "vendorId", select: "name slug" },
      });

    const filtered = ads.filter(a => a.productId); // remove non-matching
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Track click (simplified)
router.post("/:id/click", async (req, res) => {
  try {
    const ad = await AdCampaign.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Not found" });

    ad.clicks += 1;
    ad.budget -= ad.cpc;
    if (ad.budget <= 0) ad.status = "ended";
    await ad.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;