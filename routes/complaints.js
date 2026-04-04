const express = require("express");
const router  = express.Router();
const nodemailer = require("nodemailer");

// ── Nodemailer transporter ─────────────────────────────────────────────────
// Uses Yahoo SMTP. The sender account credentials come from .env
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.MAIL_USER, // same as CONTACT_EMAIL or a dedicated sender
    pass: process.env.MAIL_PASS, // Yahoo app password
  },
});

// POST /api/complaints
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const mailOptions = {
    from: `"Activ Academy" <${process.env.MAIL_USER}>`,
    to: "Os_Sh82@yahoo.com",
    replyTo: email,
    subject: `📩 رسالة/شكوى جديدة من: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7f1d1d, #dc2626); padding: 24px; color: white;">
          <h2 style="margin: 0; font-size: 20px;">📩 رسالة جديدة — Activ Academy</h2>
        </div>
        <div style="padding: 24px; background: #fff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;">الاسم:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">البريد:</td>
              <td style="padding: 8px 0; color: #dc2626;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">الرسالة:</td>
              <td style="padding: 8px 0; color: #111; line-height: 1.7;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 12px 24px; background: #f9fafb; font-size: 12px; color: #9ca3af; text-align: center;">
          تم الإرسال من نموذج التواصل — أكاديمية أكتيف
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ message: "Failed to send email.", error: err.message });
  }
});

module.exports = router;
