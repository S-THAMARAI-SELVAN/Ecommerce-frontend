import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Structure Elements
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';
import PlaceholderPage from './components/common/PlaceholderPage.jsx';

// Public Screen Views
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from './pages/CartPage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

// Private Route Guards & Screen Views
import PrivateRoute from './components/routes/PrivateRoute.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import FlipkartPremiumPage from './pages/FlipkartPremiumPage.jsx';

// Admin Route Guards & Screen Views
import AdminRoute from './components/routes/AdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        {/* Global Glassmorphic Top Navbar */}
        <Navbar />

        {/* Global Floating Toast Notifications */}
        <ToastContainer />

        {/* Dynamic Route Screen Switcher */}
        <Routes>
          {/* Public Pathways */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Secure Registered User Pathways */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/coupons" element={<FlipkartPremiumPage type="coupons" />} />
            <Route path="/supercoin" element={<FlipkartPremiumPage type="supercoin" />} />
            <Route path="/plus" element={<FlipkartPremiumPage type="plus" />} />
            <Route path="/wallet" element={<FlipkartPremiumPage type="wallet" />} />
            <Route path="/addresses" element={<FlipkartPremiumPage type="addresses" />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/giftcards" element={<FlipkartPremiumPage type="giftcards" />} />
            <Route path="/notifications" element={<FlipkartPremiumPage type="notifications" />} />
          </Route>

          {/* Secure Administrator Panels */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Additional Public/Misc Pathways */}
          <Route path="/become-seller" element={<FlipkartPremiumPage type="seller" />} />
          <Route path="/notification-preferences" element={<FlipkartPremiumPage type="notification-preferences" />} />
          <Route path="/customer-care" element={<FlipkartPremiumPage type="support" />} />
          <Route path="/advertise" element={<FlipkartPremiumPage type="advertise" />} />
          <Route path="/download-app" element={<FlipkartPremiumPage type="download-app" />} />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
