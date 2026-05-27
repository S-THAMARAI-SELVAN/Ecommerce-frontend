import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice.js';
import { addToast } from '../../features/toast/toastSlice.js';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Shield, 
  Search, 
  ChevronDown, 
  Package, 
  Heart, 
  Tag, 
  Gift, 
  Bell, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Download,
  BellRing
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Compute total cart quantity for badge
  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'Successfully logged out', type: 'info' }));
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--accent-primary)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Primary Top Header Layer */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '24px'
      }}>
        {/* Left: Brand Logo & Plus Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Link to="/" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontStyle: 'italic',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.5px'
            }}>
              AuraShop
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              color: '#ffe500',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              marginTop: '2px'
            }}>
              Explore <span style={{ color: '#ffffff', fontWeight: 600 }}>Plus</span>
              <Sparkles size={8} fill="currentColor" style={{ color: '#ffe500' }} />
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          flex: 1,
          maxWidth: '560px',
          height: '36px',
          background: '#ffffff',
          borderRadius: '2px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <input 
            type="text" 
            placeholder="Search for products, brands and more"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '0 16px',
              fontSize: '0.9rem',
              color: '#212121',
              background: '#ffffff'
            }}
          />
          <button type="submit" style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            cursor: 'pointer'
          }}>
            <Search size={20} />
          </button>
        </form>

        {/* Right: Actions and Dropdowns */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          fontSize: '0.975rem',
          fontWeight: 600
        }}>
          {/* Admin Portal Shortcut */}
          {userInfo && userInfo.isAdmin && (
            <Link to="/admin/dashboard" className="flex-center" title="Admin Portal" style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '2px',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.85rem'
            }}>
              <Shield size={14} />
              <span>Admin</span>
            </Link>
          )}

          {/* Become a Seller Link */}
          <Link to="/become-seller" style={{ color: '#ffffff' }}>
            Become a Seller
          </Link>

          {/* Profile Dropdown Container */}
          <div className="navbar-dropdown-container">
            {userInfo ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                color: '#ffffff',
                padding: '6px 0'
              }}>
                <span>{userInfo.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </div>
            ) : (
              <Link to="/login" style={{
                background: '#ffffff',
                color: 'var(--accent-primary)',
                padding: '5px 24px',
                borderRadius: '2px',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'inline-block',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Login
              </Link>
            )}

            {/* Dropdown Menu */}
            <div className="navbar-dropdown-menu">
              {!userInfo && (
                <div style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#878787', fontWeight: 500 }}>New customer?</span>
                  <Link to="/register" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Sign Up</Link>
                </div>
              )}
              
              <Link to="/profile" className="navbar-dropdown-item">
                <User size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>My Profile</span>
              </Link>

              <Link to="/plus" className="navbar-dropdown-item">
                <Sparkles size={16} style={{ color: '#ff9f00' }} />
                <span>Plus Zone</span>
              </Link>

              <Link to="/orders" className="navbar-dropdown-item">
                <Package size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Orders</span>
              </Link>

              <Link to="/wishlist" className="navbar-dropdown-item">
                <Heart size={16} style={{ color: '#fb641b' }} />
                <span>Wishlist</span>
              </Link>

              <Link to="/coupons" className="navbar-dropdown-item">
                <Tag size={16} style={{ color: '#388e3c' }} />
                <span>Coupons</span>
              </Link>

              <Link to="/giftcards" className="navbar-dropdown-item">
                <Gift size={16} style={{ color: '#e015a2' }} />
                <span>Gift Cards</span>
              </Link>

              <Link to="/notifications" className="navbar-dropdown-item">
                <Bell size={16} style={{ color: '#1976d2' }} />
                <span>Notifications</span>
              </Link>

              {userInfo && (
                <div onClick={logoutHandler} className="navbar-dropdown-item" style={{ borderTop: '1px solid #f0f0f0' }}>
                  <LogOut size={16} style={{ color: '#d32f2f' }} />
                  <span>Logout</span>
                </div>
              )}
            </div>
          </div>

          {/* More Dropdown Container */}
          <div className="navbar-dropdown-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            color: '#ffffff',
            padding: '6px 0'
          }}>
            <span>More</span>
            <ChevronDown size={14} />

            {/* Dropdown Menu */}
            <div className="navbar-dropdown-menu">
              <Link to="/notification-preferences" className="navbar-dropdown-item">
                <BellRing size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Notification Prefs</span>
              </Link>

              <Link to="/customer-care" className="navbar-dropdown-item">
                <HelpCircle size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>24x7 Customer Care</span>
              </Link>

              <Link to="/advertise" className="navbar-dropdown-item">
                <TrendingUp size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Advertise</span>
              </Link>

              <Link to="/download-app" className="navbar-dropdown-item">
                <Download size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Download App</span>
              </Link>
            </div>
          </div>

          {/* Shopping Cart Button */}
          <Link to="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            position: 'relative'
          }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {totalCartQty > 0 && (
                <span className="flex-center" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#fb641b',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                  {totalCartQty}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
