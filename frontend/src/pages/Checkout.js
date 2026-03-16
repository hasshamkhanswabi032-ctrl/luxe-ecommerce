import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  if (cart.length === 0 && !placed) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error('Please enter your delivery address');
    setPlacing(true);
    try {
      const items = cart.map(item => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      await axios.post('/api/orders', { items, totalAmount: totalPrice, address });
      clearCart();
      setPlaced(true);
      toast.success('Order placed successfully!');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally { setPlacing(false); }
  };

  if (placed) return (
    <div className="checkout-page page-container">
      <Navbar />
      <div className="order-success fade-up">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Order Confirmed</h2>
        <p className="success-sub">Thank you, {user?.name?.split(' ')[0]}. Your order has been placed and will be delivered to you shortly.</p>
        <p className="success-payment">Payment: <strong>Cash on Delivery</strong></p>
        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
          <button className="btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page page-container">
      <Navbar />
      <div className="checkout-inner">
        <div className="checkout-header fade-up">
          <h1 className="checkout-title">Checkout</h1>
        </div>
        <div className="checkout-layout">
          <div className="checkout-form fade-up">
            <div className="form-section">
              <h2 className="form-section-title">Delivery Details</h2>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-field" type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="input-field" type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Street address, city, postal code..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="form-section">
              <h2 className="form-section-title">Payment Method</h2>
              <div className="payment-option selected">
                <div className="payment-radio-dot"></div>
                <div className="payment-option-info">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-desc">Pay when your order arrives at your door</span>
                </div>
                <span className="payment-icon">◈</span>
              </div>
            </div>
          </div>

          <div className="checkout-summary fade-up">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div className="checkout-items">
                {cart.map(item => (
                  <div className="checkout-item" key={item._id}>
                    <div className="checkout-item-img">
                      <img
                        src={item.image?.startsWith('/uploads') ? `${BASE}${item.image}` : item.image}
                        alt={item.title}
                        onError={e => { e.target.src = `https://picsum.photos/seed/${item._id}/80/100`; }}
                      />
                      <span className="checkout-item-qty">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-details">
                      <span className="checkout-item-name">{item.title}</span>
                      <span className="checkout-item-price">${Number(item.price).toFixed(2)} each</span>
                    </div>
                    <span className="checkout-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-divider"></div>
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Delivery</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="checkout-summary-divider"></div>
              <div className="checkout-grand-total">
                <span>Total</span>
                <span className="grand-amount">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="btn-primary place-order-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="cod-note">You will pay ${totalPrice.toFixed(2)} upon delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
