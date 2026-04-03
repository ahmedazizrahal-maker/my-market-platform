const express = require("express");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Helper: extract Cloudinary public ID
function extractPublicId(url) {
  const parts = url.split("/");
  const filename = parts.pop();
  const folder = parts.pop();
  return `${folder}/${filename.split(".")[0]}`;
}

// Create vendor profile
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

// Get vendor profile for logged-in user
router.get("/me", requireAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
    if (!vendor) return res.json(null);
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// get for editing the product
router.get("/products/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendorId, // ensure vendor owns it
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update product (vendor only) for saving
router.put("/products/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendorId, // ensure vendor owns it
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate fields
    if (typeof req.body.currentPrice !== "number") {
      return res.status(400).json({ error: "Invalid price" });
    }

    if (typeof req.body.stock !== "number") {
      return res.status(400).json({ error: "Invalid stock" });
    }

    if (!Array.isArray(req.body.images)) {
      return res.status(400).json({ error: "Images must be an array" });
    }

    // Handle image deletion
    const oldImages = product.images;
    const newImages = req.body.images;

    const removedImages = oldImages.filter(
      (img) => !newImages.includes(img)
    );

    for (const img of removedImages) {
      const publicId = extractPublicId(img);
      await cloudinary.uploader.destroy(publicId);
    }

    // Update fields
    product.title = req.body.title;
    product.description = req.body.description;
    product.currentPrice = req.body.currentPrice;
    product.stock = req.body.stock;
    product.sku = req.body.sku;
    product.images = newImages;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Public vendor storefront (must be last)
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
