import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  return (
    <main className="container flex-center" style={{ flex: 1, padding: '60px 24px', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--accent-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
          This feature is currently under construction. Please check back later!
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
};

export default PlaceholderPage;
