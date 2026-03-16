import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', form);
      login(data.token, data.user);
      toast.success('Welcome to LUXE!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const profile = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const { data } = await axios.post('/api/auth/google', {
          googleId: profile.data.sub, email: profile.data.email,
          name: profile.data.name, avatar: profile.data.picture
        });
        login(data.token, data.user);
        toast.success('Welcome to LUXE!');
        navigate('/products');
      } catch { toast.error('Google login failed'); }
    },
    onError: () => toast.error('Google login failed'),
    flow: 'implicit'
  });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-brand">LUXE</Link>
        <div className="auth-left-content">
          <h2 className="auth-left-title">The store for<br /><em>discerning taste.</em></h2>
          <p className="auth-left-sub">Join thousands who choose quality over quantity.</p>
        </div>
        <div className="auth-left-deco">
          <div className="deco-circle deco-c1"></div>
          <div className="deco-circle deco-c2"></div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap fade-up">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Already have one? <Link to="/signin" className="auth-link">Sign in</Link></p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="input-field" type="text" placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="input-field" type="password" placeholder="At least 8 characters" required minLength={8} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <div className="divider">or</div>
          <button className="google-btn" onClick={() => googleLogin()}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.8 5.4 3 13.3l7.8 6C12.7 13.5 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 2.9-2.2 5.3-4.6 7l7.3 5.7c4.3-4 6.8-9.8 7.2-16.7z"/><path fill="#FBBC05" d="M10.8 28.7A14.4 14.4 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.3-6z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.9 2.2-6.1 0-11.3-4-13.2-9.5l-8.3 6C6.8 42.6 14.7 48 24 48z"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
