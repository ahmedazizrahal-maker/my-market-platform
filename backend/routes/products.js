const express = require("express");
const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const Vendor = require("../models/Vendor");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Vendor: create product
router.post("/", requireAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
    if (!vendor) return res.status(403).json({ error: "Not a vendor" });

    const { title, description, images, basePrice, currentPrice, sku, category, stock,imageUrl } = req.body;

    const product = await Product.create({
      vendorId: vendor._id,
      title,
      description,
      images,
      basePrice,
      currentPrice,
      sku,
      category,
      stock,
      //imageUrl,
    });

    await PriceHistory.create({
      productId: product._id,
      price: currentPrice,
      source: "local",
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// Backend route for Vendor products
router.get("/vendor/me", requireAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
    if (!vendor) return res.json([]);

    const products = await Product.find({ vendorId: vendor._id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// Public: list products (with optional search)
router.get("/", async (req, res) => {
  const { q } = req.query;
  const filter = q ? { title: new RegExp(q, "i") } : {};
  try {
    const products = await Product.find(filter).populate("vendorId", "name slug");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: product detail
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendorId", "name slug");
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: comparison for same SKU
router.get("/:id/comparison", async (req, res) => {
  try {
    const baseProduct = await Product.findById(req.params.id);
    if (!baseProduct || !baseProduct.sku) return res.json([]);

    const others = await Product.find({
      sku: baseProduct.sku,
      _id: { $ne: baseProduct._id },
    }).populate("vendorId", "name slug");

    const sorted = others.sort((a, b) => a.currentPrice - b.currentPrice);
    res.json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
