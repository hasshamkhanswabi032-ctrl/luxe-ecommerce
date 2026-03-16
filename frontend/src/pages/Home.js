import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-nav-logo">LUXE</div>
        <div className="home-nav-links">
          <Link to="/signup" className="btn-outline">Sign Up</Link>
          <Link to="/signin" className="btn-primary">Sign In</Link>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-text fade-up">
          <p className="hero-eyebrow">Curated since 2024</p>
          <h1 className="hero-title">Crafted for<br /><em>those who know.</em></h1>
          <p className="hero-sub">A carefully edited selection of premium goods,<br />chosen for enduring quality and considered design.</p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Begin Shopping</Link>
            <Link to="/signin" className="btn-outline">Sign In</Link>
          </div>
        </div>
        <div className="hero-visual fade-in">
          <div className="hero-card">
            <div className="hero-card-img">
              <div className="abstract-shape shape-1"></div>
              <div className="abstract-shape shape-2"></div>
              <div className="abstract-shape shape-3"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="brand-section">
        <div className="brand-grid">
          <div className="brand-stat"><span className="stat-number">500+</span><span className="stat-label">Curated Products</span></div>
          <div className="brand-stat"><span className="stat-number">12K</span><span className="stat-label">Happy Customers</span></div>
          <div className="brand-stat"><span className="stat-number">100%</span><span className="stat-label">Quality Assured</span></div>
        </div>
      </section>
      <section className="about-section">
        <div className="about-inner">
          <div className="about-text">
            <p className="section-label">Our Philosophy</p>
            <h2 className="about-heading">Less, but better.</h2>
            <p className="about-body">LUXE was founded on the belief that the things we surround ourselves with should earn their place. Every product we carry is chosen with deliberate care — for its materials, its craft, and its longevity.</p>
            <p className="about-body">We work directly with makers who share our standards, offering you access to pieces that outlast trends and reward daily use.</p>
          </div>
          <div className="about-decorative">
            <div className="deco-block deco-1"></div>
            <div className="deco-block deco-2"></div>
            <div className="deco-block deco-3"></div>
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-item"><div className="feature-icon">✦</div><h3>Premium Selection</h3><p>Every item passes a rigorous quality review before reaching our store.</p></div>
          <div className="feature-item"><div className="feature-icon">◈</div><h3>Cash on Delivery</h3><p>Pay when your order arrives. Simple, trustworthy, no surprises.</p></div>
          <div className="feature-item"><div className="feature-icon">◯</div><h3>Considered Returns</h3><p>If something isn't right, we make it right. Always.</p></div>
        </div>
      </section>
      <footer className="home-footer">
        <div className="footer-logo">LUXE</div>
        <p className="footer-text">© 2024 LUXE. All rights reserved.</p>
      </footer>
    </div>
  );
}
