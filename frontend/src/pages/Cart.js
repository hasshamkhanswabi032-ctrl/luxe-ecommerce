import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './Cart.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="cart-page page-container">
      <Navbar />
      <div className="cart-empty">
        <div className="cart-empty-inner fade-up">
          <span className="empty-bag-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </span>
          <h2 className="empty-title">Your bag is empty</h2>
          <p className="empty-sub">Discover our curated collection and find something you love.</p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page page-container">
      <Navbar />
      <div className="cart-inner">
        <div className="cart-header fade-up">
          <h1 className="cart-title">Your Bag</h1>
          <span className="cart-item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="cart-layout">
          <div className="cart-items fade-up">
            {cart.map((item, idx) => (
              <div className="cart-item" key={item._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="cart-item-img">
                  <img
                    src={item.image?.startsWith('/uploads') ? `${BASE}${item.image}` : item.image}
                    alt={item.title}
                    onError={e => { e.target.src = `https://picsum.photos/seed/${item._id}/200/250`; }}
                  />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                </div>
                <div className="cart-item-subtotal">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="cart-actions-row">
              <button className="btn-outline" onClick={clearCart}>Clear Bag</button>
              <Link to="/products" className="btn-outline">Continue Shopping</Link>
            </div>
          </div>
          <div className="cart-summary fade-up">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-rows">
                {cart.map(item => (
                  <div className="summary-row" key={item._id}>
                    <span className="summary-item-name">{item.title} <span className="summary-qty">×{item.quantity}</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total-row">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-price">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-shipping">
                <span className="shipping-label">Shipping</span>
                <span className="shipping-value">Calculated at checkout</span>
              </div>
              <button className="btn-primary summary-checkout" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <div className="payment-note">
                <span>◈</span> Cash on Delivery available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
