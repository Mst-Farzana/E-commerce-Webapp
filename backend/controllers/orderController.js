const mongoose = require('mongoose');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('./mailController');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      paymentMethod,
      otp,
      bankAccountNumber,
      bankAccountName,
      bankBranchName,
      bankAmount,
      visaCardNo,
      visaValidDate,
      visaSpecialNo,
      visaPinNo,
      visaAmount,
      mobileAccountNo,
      mobilePin,
      mobileAmount,
      deliveryOption,
      deliveryCharge,
      serviceCharge,
      productId,
      productName,
      price,
      quantity,
      totalPrice,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !paymentMethod ||
      !deliveryOption ||
      !productId ||
      !productName ||
      !price ||
      !quantity ||
      !totalPrice
    ) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields.' });
    }

    if (paymentMethod !== 'Cash on Delivery' && !otp) {
      return res
        .status(400)
        .json({ message: 'OTP is required for online payments.' });
    }

    const order = new Order({
      customerName,
      email,
      phone,
      address,
      paymentMethod,
      otp,
      bankAccountNumber,
      bankAccountName,
      bankBranchName,
      bankAmount,
      visaCardNo,
      visaValidDate,
      visaSpecialNo,
      visaPinNo,
      visaAmount,
      mobileAccountNo,
      mobilePin,
      mobileAmount,
      deliveryOption,
      deliveryCharge,
      serviceCharge,
      productId,
      productName,
      price,
      quantity,
      totalPrice,
    });

    await order.save();

    // ✅ Send confirmation email on new order
    let emailSent = false;
    try {
      emailSent = await sendOrderConfirmation(order);
    } catch (err) {
      console.error('❌ Failed to send email on create:', err);
    }

    return res.status(201).json({
      message: 'Order created successfully',
      order,
      emailSent,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ✅ Update order status with email
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // ✅ Send confirmation email on status update
    let emailSent = false;
    try {
      emailSent = await sendOrderConfirmation(order);
    } catch (err) {
      console.error('❌ Failed to send email on status update:', err);
    }

    res.status(200).json({
      message: 'Order status updated',
      order,
      emailSent,
    });
  } catch (error) {
    console.error('❌ Failed to update order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
