import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Create order
      const orderResponse = await axios.post(`${API_URL}/payments/create-order`, {
        amount: 19900 // ₹199
      });

      if (orderResponse.data.testMode) {
        // Test mode - simulate payment
        setMessage('✅ Test Payment Successful! (Test Mode - No charge made)');
        setLoading(false);
        return;
      }

      // In production, integrate Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_xxxx',
        amount: orderResponse.data.order.amount,
        currency: orderResponse.data.order.currency,
        name: 'AI Interview Assistant',
        description: 'Premium Subscription',
        order_id: orderResponse.data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${API_URL}/payments/verify`, {
              razorpay_order_id: response.razpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              setMessage('✅ Payment Successful!');
            } else {
              setMessage('❌ Payment verification failed');
            }
          } catch (error) {
            setMessage('❌ Error verifying payment');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0ea5e9'
        }
      };

      if (!window.Razorpay) {
        setMessage('❌ Razorpay SDK not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('❌ Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors text-lg"
      >
        {loading ? 'Processing...' : '💳 Pay ₹199 (Test Mode)'}
      </button>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <strong>Test Mode:</strong> This is a test payment. No real money will be charged. 
        Use Razorpay test credentials.
      </div>
    </div>
  );
}

export default PaymentButton;

