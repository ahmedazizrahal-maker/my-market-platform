const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendPasswordSetupEmail } = require("../utils/email");

const router = express.Router();

// Stripe requires raw body for webhook verification
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details.email;
      const productId = session.metadata.productId;
      const amount = session.amount_total;

      // 1. Find or create user
      let user = await User.findOne({ email });
      let newUserCreated = false;

      if (!user) {
        user = await User.create({
          email,
          password: null,
          isGuest: true,
        });

        newUserCreated = true;
      }

      // 2. Create order
      await Order.create({
        userId: user._id,
        productId,
        total: amount,
        status: "paid",
      });

      // 3. Send password setup email
      if (newUserCreated) {
        await sendPasswordSetupEmail(user.email, user._id);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
