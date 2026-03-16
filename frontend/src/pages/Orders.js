import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Orders.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = { pending: 'status-pending', confirmed: 'status-confirmed', delivered: 'status-delivered' };

  return (
    <div className="orders-page page-container">
      <Navbar />
      <div className="orders-inner">
        <div className="orders-header fade-up">
          <h1 className="orders-title">Your Orders</h1>
          <span className="orders-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
        </div>
        {loading ? (
          <div className="orders-loading">{[1,2,3].map(i => <div key={i} className="order-skeleton" />)}</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty fade-up">
            <span className="empty-icon">◯</span>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list fade-up">
            {orders.map((order, idx) => (
              <div className="order-card" key={order._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="order-header-right">
                    <span className={`order-status ${statusColor[order.status]}`}>{order.status}</span>
                    <span className="order-total">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <div className="order-item-img">
                        <img
                          src={item.image?.startsWith('/uploads') ? `${BASE}${item.image}` : item.image}
                          alt={item.title}
                          onError={e => { e.target.src = `https://picsum.photos/seed/${i}/60/75`; }}
                        />
                      </div>
                      <div className="order-item-info">
                        <span className="order-item-name">{item.title}</span>
                        <span className="order-item-meta">Qty: {item.quantity} · ${Number(item.price).toFixed(2)} each</span>
                      </div>
                      <span className="order-item-sub">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-footer">
                  <div className="order-footer-info">
                    <span className="footer-label">Payment</span>
                    <span className="footer-value">{order.paymentMethod}</span>
                  </div>
                  {order.address && (
                    <div className="order-footer-info">
                      <span className="footer-label">Delivery To</span>
                      <span className="footer-value">{order.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
