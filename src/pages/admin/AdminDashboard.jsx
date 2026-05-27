import React, { useEffect, useState } from 'react';
import { Shield, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import api from '../../services/api.js';
import Loader from '../../components/common/Loader.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    ordersCount: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // Execute batch metrics queries
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get('/api/products').catch(() => ({ data: [] })),
          api.get('/api/users').catch(() => ({ data: [] })),
          api.get('/api/orders').catch(() => ({ data: [] }))
        ]);

        const products = productsRes.data || [];
        const users = usersRes.data || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((acc, order) => {
          return order.isPaid ? acc + order.totalPrice : acc;
        }, 0);

        setStats({
          productsCount: products.length,
          usersCount: users.length,
          ordersCount: orders.length,
          revenue: totalRevenue
        });
      } catch (err) {
        setError('Error fetching administration logs');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <Loader size="50px" />;

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Shield size={28} style={{ color: 'var(--accent-secondary)' }} />
        <span>Admin Dashboard</span>
      </h1>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', marginBottom: '32px' }}>
          {error}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        
        {/* Card: Revenue */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(20,24,33,0.5)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(218,165,32,0.1)', border: '1px solid rgba(218,165,32,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-secondary)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              ₹{Math.floor(stats.revenue).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Card: Sales Orders */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(20,24,33,0.5)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(250,84,66,0.1)', border: '1px solid rgba(250,84,66,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Orders</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {stats.ordersCount}
            </div>
          </div>
        </div>

        {/* Card: Customers */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(20,24,33,0.5)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customers</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {stats.usersCount}
            </div>
          </div>
        </div>

        {/* Card: Catalog listings */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(20,24,33,0.5)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-info)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Products</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {stats.productsCount}
            </div>
          </div>
        </div>

      </div>

      {/* Analytics layout blocks */}
      <section className="glass-panel" style={{ padding: '32px', background: 'rgba(13, 16, 23, 0.7)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Operations Board</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Welcome to the telemetry board. From here you can run full audits, dispatch orders, alter catalog stock, and control user credentials.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={() => alert('Accessing Catalog Panel...')}>Catalog Settings</button>
          <button className="btn btn-secondary" onClick={() => alert('Accessing Customer Panel...')}>Manage Customers</button>
          <button className="btn btn-secondary" onClick={() => alert('Accessing Invoices Panel...')}>Order Invoices</button>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
