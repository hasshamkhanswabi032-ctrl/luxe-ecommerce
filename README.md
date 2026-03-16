# LUXE — MERN E-Commerce Platform

A premium full-stack e-commerce application built with MongoDB, Express, React, and Node.js.

## Design System
- **Palette**: Cream (#F5F0E8), Charcoal (#1A1A18), Gold (#C9A84C)
- **Fonts**: Cormorant Garamond (display) + DM Sans (body)
- **Aesthetic**: Refined luxury editorial — minimal, premium, human

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Google Client ID
npm run dev         # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
# Create .env file:
echo "REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id" > .env
echo "REACT_APP_API_URL=http://localhost:5000" >> .env
npm start           # runs on http://localhost:3000
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home / brand landing page |
| `/signup` | Public | Register new account |
| `/signin` | Public | Login |
| `/products` | Auth | Product catalog |
| `/cart` | Auth | Shopping cart |
| `/checkout` | Auth | Place order (COD) |
| `/orders` | Auth | Order history |
| `/admin` | Admin | Admin panel |

## Making Someone an Admin
1. Sign up normally via the app
2. Open MongoDB Compass (or shell)
3. Find the user document
4. Set `role: "admin"` and save

Then sign in — you'll be redirected to `/admin` automatically.

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:3000` to Authorized origins
5. Copy the Client ID into both `.env` files

## Features
- JWT authentication (7-day tokens)
- Google OAuth login
- Product catalog with search
- Cart with quantity controls (persisted to localStorage)
- Checkout with Cash on Delivery
- Order history
- Admin panel: add/delete products, view all orders, stats dashboard
- Image upload (multer) or URL
- Responsive design

## Tech Stack
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, Multer, bcryptjs
- **Frontend**: React 18, React Router 6, Axios, React Hot Toast, @react-oauth/google
