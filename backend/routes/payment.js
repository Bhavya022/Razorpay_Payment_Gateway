import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import pool from '../database/db.js';

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
router.post('/order', (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const options = {
      amount: Number(amount * 100),
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Order creation failed' });
      }

      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user_id,
  } = req.body;

  try {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;

    const status = isAuthentic ? 'success' : 'failure';

    const insertQuery = `
      INSERT INTO payments (
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user_id,
        status
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      status,
    ];

    pool.query(insertQuery, values, async (err) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ message: 'Database Error' });
      }

      // Send Email after DB insert
      sendEmails(user_id, razorpay_order_id, razorpay_payment_id, status);

      return res.status(isAuthentic ? 200 : 400).json({
        message: isAuthentic
          ? 'Payment Verified and Saved Successfully'
          : 'Invalid Signature',
      });
    });
  } catch (err) {
    console.error('Verify Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const sendEmails = (user_id, orderId, paymentId, status) => {
  const subject =
    status === 'success' ? '✅ Payment Successful' : '❌ Payment Failed';

  const html = `
    <h3>Payment ${status === 'success' ? 'Successful' : 'Failed'}</h3>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Payment ID:</strong> ${paymentId}</p>
    <p><strong>Status:</strong> ${status.toUpperCase()}</p>
  `;

  // Fetch user's email from DB
  const sql = 'SELECT email FROM users WHERE id = ?';
  pool.query(sql, [user_id], async (err, result) => {
    if (err || result.length === 0) {
      return console.error('Failed to fetch user email:', err);
    }

    const userEmail = result[0].email || 'khatri.bhavya22@gmail.com';
    const adminEmail = 'contact@topsqill.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'info@Topsqill.com',
        pass: process.env.EMAIL_PASS || 'oswuqcgdorjtwtxv',
      },
    });

    try {
      await transporter.sendMail({
        from: `"TopSqill" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject,
        html,
      });

      await transporter.sendMail({
        from: `"TopSqill" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `[Admin Copy] ${subject}`,
        html,
      });

      console.log('Emails sent successfully');
    } catch (emailErr) {
      console.error('Email Send Error:', emailErr);
    }
  });
};

export default router;
