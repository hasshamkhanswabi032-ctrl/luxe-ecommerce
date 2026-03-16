import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500);
    toast.success(`${product.title} added to cart`);
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="products-page page-container">
      <Navbar />
      <div className="products-header">
        <div className="products-header-inner">
          <h1 className="products-title">The Collection</h1>
          <p className="products-count">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</p>
          <input
            className="input-field search-input"
            type="text"
            placeholder="Search the collection..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-body">
        {loading ? (
          <div className="products-loading">
            {[1,2,3,4,5,6].map(i => <div key={i} className="product-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="products-empty">
            <span className="empty-icon">◯</span>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product, idx) => (
              <div className="product-card fade-up" key={product._id} style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="product-img-wrap">
                  <img
                    src={product.image.startsWith('/uploads') ? `${BASE}${product.image}` : product.image}
                    alt={product.title}
                    className="product-img"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${product._id}/400/500`; }}
                  />
                  <div className="product-img-overlay">
                    <button
                      className={`quick-add ${added[product._id] ? 'added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {added[product._id] ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-meta">
                    <h3 className="product-title">{product.title}</h3>
                    {product.category && <span className="product-category">{product.category}</span>}
                  </div>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${Number(product.price).toFixed(2)}</span>
                    <button
                      className={`add-btn ${added[product._id] ? 'added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {added[product._id] ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
