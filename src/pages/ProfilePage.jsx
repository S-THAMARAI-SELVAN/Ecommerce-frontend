import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, User, Shield, Calendar } from 'lucide-react';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        setErrorOrders(err.response?.data?.message || err.message);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setUpdating(true);
      await api.put('/api/users/profile', { name, email, password });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
        alignItems: 'start'
      }} className="profile-layout-query">
        
        {/* Left Side: Profile Editing Details */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={22} style={{ color: 'var(--accent-primary)' }} />
            <span>User Profile</span>
          </h2>

          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Profile updated successfully
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', marginBottom: '20px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                disabled // Standard production practice: block direct email shifts on generic profile pages
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Leave blank to keep current password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Confirm password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={updating}>
              {updating ? 'Saving...' : 'Update Settings'}
            </button>
          </form>
        </div>

        {/* Right Side: User Purchase Order History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={22} style={{ color: 'var(--accent-primary)' }} />
            <span>Order History</span>
          </h2>

          {loadingOrders ? (
            <Loader size="30px" />
          ) : errorOrders ? (
            <div className="glass-panel" style={{ padding: '24px', color: 'var(--color-error)' }}>{errorOrders}</div>
          ) : orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              You have not placed any orders yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order._id} className="glass-panel" style={{
                  padding: '20px',
                  background: 'rgba(20, 24, 33, 0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ORDER ID: {order._id}</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>Total: ₹{Math.floor(order.totalPrice).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <span style={{
                      background: order.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: order.isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      color: order.isPaid ? 'var(--color-success)' : 'var(--color-error)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {order.isPaid ? 'PAID' : 'UNPAID'}
                    </span>
                    <span style={{
                      background: order.isDelivered ? 'rgba(16, 185, 129, 0.1)' : 'rgba(218, 165, 32, 0.1)',
                      border: order.isDelivered ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(218, 165, 32, 0.3)',
                      color: order.isDelivered ? 'var(--color-success)' : 'var(--accent-secondary)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {order.isDelivered ? 'DELIVERED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .profile-layout-query {
            grid-template-columns: 1fr 2fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default ProfilePage;
