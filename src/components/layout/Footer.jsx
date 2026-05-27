import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: 'auto',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid rgba(255, 255, 255, 0.03)',
      padding: '40px 0 30px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)'
        }}>
          AURA<span style={{ color: 'var(--accent-primary)' }}>SHOP</span>
        </div>
        <p style={{ textAlign: 'center', maxWidth: '500px' }}>
          Discover custom-built minimalist essentials and luxury goods. Handcrafted quality backed by our full checkout protection policy.
        </p>
        <div style={{
          display: 'flex',
          gap: '24px',
          margin: '8px 0'
        }}>
          <a href="#" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a>
          <a href="#" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a>
          <a href="#" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Contact Support</a>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          width: '100%',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          &copy; {currentYear} AuraShop. All rights reserved. Designed for elite developers and digital merchants.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
