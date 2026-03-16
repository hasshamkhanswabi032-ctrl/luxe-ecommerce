import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  const [tab, setTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const fileRef = useRef();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', stock: '100', imageUrl: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/products'),
        axios.get('/api/admin/orders'),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0]);
      const res = await axios.post('/api/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts(prev => [res.data, ...prev]);
      setStats(prev => ({ ...prev, products: prev.products + 1 }));
      setForm({ title: '', description: '', price: '', category: '', stock: '100', imageUrl: '' });
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      setShowForm(false);
      toast.success('Product added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, products: Math.max(0, prev.products - 1) }));
      toast.success('Product deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleOrderStatus = async (id, newStatus) => {
    setUpdatingOrder(id);
    try {
      const res = await axios.put(`/api/admin/orders/${id}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: res.data.status } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update order status');
    } finally { setUpdatingOrder(null); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const statusOptions = ['pending', 'confirmed', 'delivered'];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">LUXE</div>
        <div className="admin-brand-sub">Admin Panel</div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            <span className="nav-icon">⬡</span> Products
          </button>
          <button className={`admin-nav-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            <span className="nav-icon">◈</span> Orders
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-signout" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span className="astat-label">Total Products</span>
              <span className="astat-val">{stats.products}</span>
            </div>
            <div className="admin-stat-card">
              <span className="astat-label">Total Orders</span>
              <span className="astat-val">{stats.orders}</span>
            </div>
            <div className="admin-stat-card">
              <span className="astat-label">Total Users</span>
              <span className="astat-val">{stats.users}</span>
            </div>
            <div className="admin-stat-card admin-stat-gold">
              <span className="astat-label">Total Revenue</span>
              <span className="astat-val">${Number(stats.revenue).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {tab === 'products' && (
          <div className="admin-section fade-up">
            <div className="section-header">
              <h2 className="section-heading">Products</h2>
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>

            {showForm && (
              <div className="add-product-form fade-up">
                <h3 className="form-heading">New Product</h3>
                <form onSubmit={handleSubmit} className="product-form-grid">
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Product name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Accessories" />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Description *</label>
                    <textarea className="input-field" required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description" style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (USD) *</label>
                    <input className="input-field" type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="input-field" type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Image — Upload a file</label>
                    <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="input-field file-input" />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">— or paste an image URL</label>
                    <input className="input-field" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                  </div>
                  {preview && (
                    <div className="form-group full-width">
                      <img src={preview} alt="Preview" className="img-preview" />
                    </div>
                  )}
                  <div className="form-group full-width">
                    <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Product'}</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="admin-loading">{[1,2,3].map(i => <div key={i} className="admin-skeleton" />)}</div>
            ) : products.length === 0 ? (
              <div className="admin-empty"><span className="empty-icon">◯</span><p>No products yet. Add your first product above.</p></div>
            ) : (
              <div className="admin-products-table">
                <div className="table-header-row">
                  <span>Product</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Stock</span>
                  <span>Actions</span>
                </div>
                {products.map(p => (
                  <div className="table-row" key={p._id}>
                    <div className="table-product-cell">
                      <div className="table-product-img">
                        <img
                          src={p.image?.startsWith('/uploads') ? `${BASE}${p.image}` : p.image}
                          alt={p.title}
                          onError={e => { e.target.src = `https://picsum.photos/seed/${p._id}/60/75`; }}
                        />
                      </div>
                      <div>
                        <span className="table-product-name">{p.title}</span>
                        <span className="table-product-desc">{p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}</span>
                      </div>
                    </div>
                    <span className="table-cell">{p.category || '—'}</span>
                    <span className="table-cell">${Number(p.price).toFixed(2)}</span>
                    <span className="table-cell">{p.stock}</span>
                    <span className="table-cell">
                      <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-section fade-up">
            <div className="section-header">
              <h2 className="section-heading">All Orders</h2>
              <span className="orders-count-badge">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
            </div>
            <div className="admin-orders-list">
              {orders.length === 0 ? (
                <div className="admin-empty"><span className="empty-icon">◯</span><p>No orders yet.</p></div>
              ) : orders.map(order => (
                <div className="admin-order-row" key={order._id}>
                  <div className="admin-order-header">
                    <div>
                      <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="order-user">{order.user?.name} · {order.user?.email}</span>
                    </div>
                    <div className="admin-order-right">
                      <select
                        className={`order-status-select status-${order.status}`}
                        value={order.status}
                        onChange={e => handleOrderStatus(order._id, e.target.value)}
                        disabled={updatingOrder === order._id}
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <span className="admin-order-total">${Number(order.totalAmount).toFixed(2)}</span>
                      <span className="order-date-small">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="admin-order-items">
                    {order.items.map((item, i) => (
                      <span key={i} className="admin-order-item-tag">{item.title} ×{item.quantity}</span>
                    ))}
                  </div>
                  {order.address && (
                    <div className="admin-order-address">
                      <span className="address-label">📦 Deliver to:</span> {order.address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
