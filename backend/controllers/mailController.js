require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '9343fc002@smtp-brevo.com', // Brevo SMTP login (env থেকে নিতে পারেন)
    pass: process.env.EMAIL_PASS, // SMTP password/API key
  },
});

exports.sendMail = async (req, res) => {
  try {
    const { email, customerName, productName, status } = req.body;
    if (!email || !customerName || !productName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Use the sendOrderConfirmation function internally to send email
    const emailSent = await exports.sendOrderConfirmation({
      email,
      customerName,
      productName,
      status,
    });

    if (emailSent) {
      res.status(200).json({ message: '✅ Email sent successfully!' });
    } else {
      res.status(500).json({ message: '❌ Failed to send email' });
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({ message: '❌ Failed to send email' });
  }
};

exports.sendOrderConfirmation = async order => {
  try {
    let subject = 'Order Update';
    let textContent = '';
    let htmlContent = '';

    switch (order.status) {
      case 'confirmed':
        subject = 'Your Order is Confirmed';
        textContent = `Hello ${order.customerName},\n\nYour order for ${order.productName} has been confirmed. We will notify you when it ships.\n\nThank you!`;
        htmlContent = `<p>Hello <strong>${order.customerName}</strong>,</p>
          <p>Your order for <strong>${order.productName}</strong> has been <strong>confirmed</strong>.</p>`;
        break;

      case 'shipped':
        subject = 'Your Order is Shipped';
        textContent = `Hello ${order.customerName},\n\nYour order for ${order.productName} has been shipped and is on the way.\n\nThank you!`;
        htmlContent = `<p>Hello <strong>${order.customerName}</strong>,</p>
          <p>Your order for <strong>${order.productName}</strong> has been <strong>shipped</strong>.</p>`;
        break;

      case 'delivered':
        subject = 'Order Delivered';
        textContent = `Hello ${order.customerName},\n\nYour order for ${order.productName} has been delivered successfully.\n\nWe hope you enjoy your purchase!`;
        htmlContent = `<p>Hello <strong>${order.customerName}</strong>,</p>
          <p>Your order for <strong>${order.productName}</strong> has been <strong>delivered</strong>.</p>`;
        break;

      case 'cancelled':
        subject = 'Order Cancelled';
        textContent = `Hello ${order.customerName},\n\nYour order for ${order.productName} has been cancelled. If you have any questions, contact support.\n\nThank you.`;
        htmlContent = `<p>Hello <strong>${order.customerName}</strong>,</p>
          <p>Your order for <strong>${order.productName}</strong> has been <strong>cancelled</strong>.</p>`;
        break;

      default:
        subject = 'Order Confirmation';
        textContent = `Hello ${order.customerName},\n\nYour order for ${order.productName} has been received and is being processed.\n\nThank you!`;
        htmlContent = `<p>Hello <strong>${order.customerName}</strong>,</p>
          <p>Your order for <strong>${order.productName}</strong> has been received and is being processed.</p>`;
    }

    htmlContent += `<p>Thanks for shopping with <strong>ShopEase</strong>!</p>`;

    const mailOptions = {
      from: `"ShopEase" <farzanap1531994@gmail.com>`, // Verified sender email
      to: order.email,
      subject,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${order.email} with subject: "${subject}"`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    return false;
  }
};
