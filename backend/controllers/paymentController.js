import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxx'
});

export async function createOrder(req, res) {
  try {
    const { amount = 19900 } = req.body; // ₹199 default

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `test_order_${Date.now()}`,
      payment_capture: 1
    };

    if (process.env.TEST_MODE === 'true') {
      // In test mode, return mock order
      return res.json({
        success: true,
        order: {
          id: `order_test_${Date.now()}`,
          amount: amount,
          currency: 'INR',
          receipt: options.receipt,
          status: 'created'
        },
        testMode: true
      });
    }

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      testMode: process.env.TEST_MODE === 'true'
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      testMode: process.env.TEST_MODE === 'true'
    });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (process.env.TEST_MODE === 'true') {
      // In test mode, always return success
      return res.json({
        success: true,
        message: 'Test Payment Successful! (Test Mode)',
        paymentId: razorpay_payment_id || 'test_payment_id',
        orderId: razorpay_order_id || 'test_order_id',
        testMode: true
      });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (isSignatureValid) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

