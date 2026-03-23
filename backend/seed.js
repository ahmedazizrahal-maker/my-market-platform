require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Vendor = require("./models/Vendor");
const Product = require("./models/Product");
const PriceHistory = require("./models/PriceHistory");
const AdCampaign = require("./models/AdCampaign");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clear collections
  await User.deleteMany();
  await Vendor.deleteMany();
  await Product.deleteMany();
  await PriceHistory.deleteMany();
  await AdCampaign.deleteMany();

  console.log("Database cleared");

  // Create admin
  const admin = await User.create({
    email: "admin@example.com",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "admin",
  });

  // Create vendors
  const vendor1User = await User.create({
    email: "vendor1@example.com",
    passwordHash: await bcrypt.hash("vendor123", 10),
    role: "vendor",
  });

  const vendor2User = await User.create({
    email: "vendor2@example.com",
    passwordHash: await bcrypt.hash("vendor123", 10),
    role: "vendor",
  });

  const vendor1 = await Vendor.create({
    ownerUserId: vendor1User._id,
    name: "TechZone",
    slug: "techzone",
    logo: "",
  });

  const vendor2 = await Vendor.create({
    ownerUserId: vendor2User._id,
    name: "GadgetHub",
    slug: "gadgethub",
    logo: "",
  });

  // Create products
  const products = await Product.insertMany([
    {
      vendorId: vendor1._id,
      title: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      images: [],
      basePrice: 2000,
      currentPrice: 1800,
      sku: "MOUSE123",
      category: "electronics",
      stock: 50,
    },
    {
      vendorId: vendor1._id,
      title: "Mechanical Keyboard",
      description: "RGB mechanical keyboard",
      images: [],
      basePrice: 8000,
      currentPrice: 7500,
      sku: "KEYB123",
      category: "electronics",
      stock: 30,
    },
    {
      vendorId: vendor2._id,
      title: "Wireless Mouse",
      description: "Compact wireless mouse",
      images: [],
      basePrice: 1900,
      currentPrice: 1700,
      sku: "MOUSE123",
      category: "electronics",
      stock: 40,
    },
  ]);

  // Price history
  for (const p of products) {
    await PriceHistory.create({
      productId: p._id,
      price: p.currentPrice,
      source: "local",
    });
  }

  // Ad campaigns
  await AdCampaign.create({
    vendorId: vendor1._id,
    productId: products[0]._id,
    name: "Mouse Promo",
    budget: 5000,
    cpc: 100,
  });

  console.log("Seed completed");
  process.exit();
}

seed();