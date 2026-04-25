import nodemailer from "nodemailer";

export async function sendPasswordSetupEmail(email, userId) {
  const link = `${process.env.FRONTEND_URL}/set-password?uid=${userId}`;

  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Marketplace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Set your password",
    html: `
      <h2>Welcome to our marketplace!</h2>
      <p>We created an account for you so you can track your orders.</p>
      <p>Click the link below to set your password:</p>
      <a href="${link}" style="padding:10px 20px;background:#2563eb;color:white;border-radius:6px;text-decoration:none;">
        Set Password
      </a>
      <p>If you didn’t make this purchase, please ignore this email.</p>
    `,
  });
}
