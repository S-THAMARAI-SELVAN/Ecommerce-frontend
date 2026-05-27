import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';
import { Package, Clock, CheckCircle, Truck, Calendar, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { addToast } from '../features/toast/toastSlice.js';
import { useDispatch } from 'react-redux';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve your orders index. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={32} style={{ color: 'var(--accent-primary)' }} />
          <span>My Orders ({orders.length})</span>
        </h1>
        <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Shop Products
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <p style={{ color: 'var(--color-error)', marginBottom: '16px', fontWeight: 500 }}>{error}</p>
          <button onClick={fetchOrders} className="btn btn-secondary">Try Syncing Again</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <Package size={64} style={{ color: 'var(--text-muted)' }} />
          <h3>No Orders Found!</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            It looks like you have not placed any orders yet. Explore our awesome catalog of mobiles, fashion, home decor, electronics, and start shopping!
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* Order Metadata Top Bar */}
              <div style={{
                background: 'var(--bg-primary)',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{order._id}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Placed On</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-primary)' }} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Ship To</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}` : 'Default Address'}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>Total Paid</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ₹{Math.floor(order.totalPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order Items & Live Tracking Status */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Live Delivery/Payment tracking pill */}
                <div style={{
                  background: '#f9f9f9',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} style={{ color: '#388e3c' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      Payment Method: <span style={{ color: '#388e3c' }}>{order.paymentMethod || 'Credit Card'}</span>
                    </span>
                    {order.isPaid ? (
                      <span style={{ background: '#edfbf1', color: '#388e3c', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '2px' }}>PAID</span>
                    ) : (
                      <span style={{ background: '#fef0ef', color: '#d32f2f', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '2px' }}>PENDING</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                    {order.isDelivered ? (
                      <>
                        <CheckCircle size={16} style={{ color: '#388e3c' }} />
                        <span style={{ color: '#388e3c' }}>Delivered on {formatDate(order.deliveredAt)}</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} style={{ color: '#ff9f00' }} />
                        <span style={{ color: '#ff9f00' }}>Processing / Out for Delivery</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      paddingBottom: idx === order.orderItems.length - 1 ? 0 : '16px',
                      borderBottom: idx === order.orderItems.length - 1 ? 'none' : '1px solid #f0f0f0'
                    }}>
                      
                      {/* Left: Thumbnail & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.06)' }}
                        />
                        <div>
                          <Link to={`/product/${item.product}`}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                              {item.name}
                            </h4>
                          </Link>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quantity: {item.qty}</span>
                        </div>
                      </div>

                      {/* Right: Item pricing and Buy Again */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{Math.floor(item.price).toLocaleString('en-IN')}
                        </span>
                        <Link to={`/product/${item.product}`} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>Buy Again</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
