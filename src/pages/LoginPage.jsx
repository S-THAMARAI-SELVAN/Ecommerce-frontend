import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { LogIn, Key, Mail, AlertTriangle } from 'lucide-react';
import Loader from '../components/common/Loader.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const expiredSession = searchParams.get('expired');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already authenticated, redirect to homepage
    if (userInfo) {
      navigate('/');
    }
    // Clean prior errors on load
    dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login({ email, password })).unwrap();
      dispatch(addToast({ message: `Welcome back, ${res.name}!`, type: 'success' }));
      navigate('/');
    } catch (err) {
      dispatch(addToast({ message: err || 'Login failed', type: 'error' }));
    }
  };

  return (
    <main className="flex-center" style={{ flex: 1, padding: '60px 24px' }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        background: 'var(--bg-secondary)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Header Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sign in to manage your orders and profile</p>
        </div>

        {/* Warning notification for expired sessions */}
        {expiredSession && !error && (
          <div style={{
            background: 'rgba(218, 165, 32, 0.1)',
            border: '1px solid rgba(218, 165, 32, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--accent-orange)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertTriangle size={16} />
            <span>Your security session expired. Please sign in again.</span>
          </div>
        )}

        {/* Error notification banner */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            color: 'var(--color-error)',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Form Form */}
        <form onSubmit={submitHandler}>
          {/* Email input field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login button submission */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', gap: '8px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? (
              <Loader size="20px" color="#fff" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Navigation Footer */}
        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          New customer?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>

        {/* Demo Credentials Box */}
        <div className="glass-panel" style={{
          marginTop: '32px',
          padding: '16px 20px',
          background: 'var(--bg-primary)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Demo Sandbox Access (Click to auto-fill):</div>
          
          <button 
            type="button"
            onClick={() => {
              setEmail('admin@ecommerce.com');
              setPassword('password123');
            }}
            style={{ 
              textAlign: 'left', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(0,0,0,0.05)', 
              padding: '6px 10px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              fontSize: '0.8rem',
              color: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <strong>Admin:</strong> <code>admin@ecommerce.com</code> / <code>password123</code>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setEmail('john@example.com');
              setPassword('password123');
            }}
            style={{ 
              textAlign: 'left', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(0,0,0,0.05)', 
              padding: '6px 10px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              fontSize: '0.8rem',
              color: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <strong>User:</strong> <code>john@example.com</code> / <code>password123</code>
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
