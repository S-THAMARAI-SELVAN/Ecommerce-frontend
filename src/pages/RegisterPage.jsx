import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { User, Mail, Key, UserPlus } from 'lucide-react';
import Loader from '../components/common/Loader.jsx';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await dispatch(register({ name, email, password })).unwrap();
      dispatch(addToast({ message: `Account created, welcome ${res.name}!`, type: 'success' }));
      navigate('/');
    } catch (err) {
      dispatch(addToast({ message: err || 'Registration failed', type: 'error' }));
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Join AuraShop and start shopping premium gear</p>
        </div>

        {(validationError || error) && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            color: 'var(--color-error)',
            marginBottom: '20px'
          }}>
            {validationError || error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

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
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
