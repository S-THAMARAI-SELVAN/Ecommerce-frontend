import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../features/toast/toastSlice.js';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Ticket, 
  CreditCard, 
  MapPin, 
  Gift, 
  Bell, 
  HelpCircle, 
  TrendingUp, 
  Download, 
  BellRing,
  Plus, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Star, 
  Truck,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const FlipkartPremiumPage = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState('');
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', address: '', type: 'Home' });
  const [addresses, setAddresses] = useState([
    { name: 'John Doe', phone: '9876543210', address: '123 Main Street, Appt 4B, New York, NY 10001', type: 'Home' },
    { name: 'John Doe', phone: '9876543210', address: 'Tech Solutions Corp, 500 Seventh Ave, New York, NY 10018', type: 'Work' }
  ]);
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '' });
  const [cards, setCards] = useState([
    { number: '•••• •••• •••• 4321', name: 'JOHN DOE', expiry: '12/28', type: 'Visa' }
  ]);
  const [activeFaq, setActiveFaq] = useState(null);

  // Trigger positive toast interactions
  const triggerInteraction = (message, toastType = 'success') => {
    dispatch(addToast({ message, type: toastType }));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    triggerInteraction(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      triggerInteraction('Please fill out all address fields.', 'error');
      return;
    }
    setAddresses([...addresses, addressForm]);
    setAddressForm({ name: '', phone: '', address: '', type: 'Home' });
    triggerInteraction('Delivery address added successfully!');
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.name || !cardForm.expiry) {
      triggerInteraction('Please fill out all card details.', 'error');
      return;
    }
    const formattedNum = `•••• •••• •••• ${cardForm.number.slice(-4)}`;
    setCards([...cards, { ...cardForm, number: formattedNum, type: 'MasterCard' }]);
    setCardForm({ number: '', name: '', expiry: '' });
    triggerInteraction('Payment card registered successfully!');
  };

  // RENDER SELLER PLATFORM
  const renderSeller = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: '#ffffff',
        padding: '60px 32px',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <TrendingUp size={48} style={{ color: 'var(--accent-secondary)' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Launch Your Business in Minutes</h1>
        <p style={{ maxWidth: '600px', fontSize: '1.1rem', opacity: 0.9 }}>
          Join over 1,000,000 active sellers on AuraShop and reach over 450 million registered customers worldwide.
        </p>
        <button 
          onClick={() => triggerInteraction('Seller application initiated! Redirecting...')} 
          className="btn" 
          style={{ background: 'var(--accent-secondary)', color: '#212121', padding: '14px 36px', fontSize: '1.05rem', fontWeight: 700 }}
        >
          Start Selling Today
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <Truck size={32} style={{ color: '#2874f0', marginBottom: '12px' }} />
          <h3>Fast Delivery Network</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            Ship to over 19,000 pincodes with our fully managed logistics, support, and packaging.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <ShieldCheck size={32} style={{ color: '#388e3c', marginBottom: '12px' }} />
          <h3>Secure & Timely Pay</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            Get secure and faster payments directly into your bank account within 7 days of delivery.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <MessageSquare size={32} style={{ color: '#ff9f00', marginBottom: '12px' }} />
          <h3>24x7 Seller Support</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            Get expert guidance at every step, along with free account management for the first 30 days.
          </p>
        </div>
      </div>
    </div>
  );

  // RENDER COUPONS
  const renderCoupons = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Ticket style={{ color: 'var(--accent-primary)' }} />
        <span>Available Vouchers & Coupons</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {[
          { code: 'AURA20', title: 'Flat 20% Off Electronics', minSpend: '$150', expiry: '30 May 2026', bg: '#eef6ff', border: '#2874f0' },
          { code: 'SUPERPLUS', title: '$30 Cash Back on Home items', minSpend: '$200', expiry: '12 Jun 2026', bg: '#fefcf0', border: '#ff9f00' },
          { code: 'FREESHIP', title: '100% Free Express Shipping', minSpend: '$30', expiry: '05 Jun 2026', bg: '#edfbf1', border: '#388e3c' }
        ].map((item) => (
          <div key={item.code} className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px dashed ${item.border}`,
            background: item.bg,
            padding: '20px',
            position: 'relative'
          }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '6px' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Minimum Spend: {item.minSpend}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Expires on: {item.expiry}</p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              background: '#ffffff',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <code style={{ fontSize: '1rem', fontWeight: 700, color: '#212121' }}>{item.code}</code>
              <button 
                onClick={() => handleCopyCode(item.code)} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedCode === item.code ? <Check size={16} style={{ color: '#388e3c' }} /> : <Copy size={16} />}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{copiedCode === item.code ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // RENDER SUPERCOIN
  const renderSupercoin = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
        color: '#ffffff',
        padding: '40px 32px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award style={{ color: 'var(--accent-secondary)' }} size={32} />
            <span>SuperCoin Zone</span>
          </h1>
          <p style={{ opacity: 0.9, marginTop: '8px', fontSize: '1rem' }}>Earn coins on every order and unlock exclusive rewards!</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '16px 28px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Current Balance</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '4px' }}>120 🪙</h2>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>Redeem Coins For Rewards</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { title: '1-Month Free Premium SoundShield', coins: 50, desc: 'Listen to music without interruptions.' },
            { title: '$10 Store Voucher Discount', coins: 80, desc: 'Applicable across all electronic items.' },
            { title: 'Free Movie Ticket Voucher', coins: 100, desc: 'Valid at all participating theaters.' }
          ].map((reward) => (
            <div key={reward.title} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{reward.coins} COINS</div>
              <h4>{reward.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{reward.desc}</p>
              <button 
                onClick={() => triggerInteraction(`Claimed "${reward.title}" using ${reward.coins} SuperCoins!`)}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px 16px' }}
              >
                Claim Reward
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // RENDER PLUS ZONE
  const renderPlus = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #091e3a 0%, #2f80ed 100%)',
        color: '#ffffff',
        padding: '50px 32px',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Sparkles size={48} style={{ color: 'var(--accent-secondary)' }} />
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome to AuraShop Plus</h1>
        <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '1.05rem' }}>
          Enjoy the elite club benefits. Zero additional fees, high-speed shipping, and premium customer service.
        </p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '8px 24px',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginTop: '8px'
        }}>
          ✓ ACTIVE MEMBER
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[
          { title: 'Free Express Shipping', desc: 'Auto free shipping on all eligible Plus tags without a minimum purchase limit.', icon: <Truck size={24} style={{ color: 'var(--accent-primary)' }} /> },
          { title: '2x More SuperCoins', desc: 'Get double SuperCoins on every purchase compared to regular members.', icon: <Award size={24} style={{ color: '#ff9f00' }} /> },
          { title: 'Early Access Deals', desc: 'Gain early shopping entry into all big sale catalogs 24 hours in advance.', icon: <Star size={24} style={{ color: '#fb641b' }} /> }
        ].map((benefit) => (
          <div key={benefit.title} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {benefit.icon}
            <h4>{benefit.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // RENDER WALLET
  const renderWallet = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="listing-layout-query">
      {/* Saved cards list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3>Your Saved Cards</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cards.map((card, idx) => (
            <div key={idx} className="glass-panel" style={{
              background: 'linear-gradient(135deg, #141721 0%, #30374a 100%)',
              color: '#ffffff',
              padding: '24px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '160px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>{card.type} CARD</span>
                <CreditCard size={24} style={{ color: 'var(--accent-secondary)' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '2px', color: '#fff' }}>{card.number}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.65rem' }}>CARDHOLDER</span>
                  <span>{card.name}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.65rem' }}>EXPIRES</span>
                  <span>{card.expiry}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Card Form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3>Add New Card</h3>
        <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input 
              type="text" 
              maxLength="16"
              placeholder="1234567890123456" 
              className="form-input" 
              value={cardForm.number}
              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                className="form-input" 
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="JOHN DOE" 
                className="form-input" 
                value={cardForm.name}
                onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Card</button>
        </form>
      </div>
    </div>
  );

  // RENDER ADDRESSES
  const renderAddresses = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="listing-layout-query">
      {/* Active Addresses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3>Saved Locations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {addresses.map((addr, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  background: 'var(--bg-primary)',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)'
                }}>{addr.type.toUpperCase()}</span>
                <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h4 style={{ fontWeight: 600 }}>{addr.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone: {addr.phone}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{addr.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add address form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3>Add Delivery Address</h3>
        <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address Line</label>
            <input 
              type="text" 
              className="form-input" 
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address Type</label>
            <select 
              className="form-input"
              value={addressForm.type}
              onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Address</button>
        </form>
      </div>
    </div>
  );

  // RENDER GIFT CARDS
  const renderGiftCards = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="listing-layout-query">
      {/* Gift Card info and balance */}
      <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Gift size={36} style={{ color: '#fb641b' }} />
        <h3>AuraShop Gift Voucher Balance</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Redeem your corporate or gift vouchers to load balance and pay in 1-click on checking out.
        </p>
        <div style={{
          background: 'var(--bg-primary)',
          padding: '16px 20px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Your Balance:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>$0.00</span>
        </div>
      </div>

      {/* Redeem coupon pin */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3>Redeem Gift Card</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Gift Card Number</label>
            <input type="text" placeholder="16-digit card number" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Gift Card PIN</label>
            <input type="text" placeholder="6-digit pin" className="form-input" />
          </div>
          <button 
            onClick={() => triggerInteraction('Gift Card balance redeemed successfully! Balance updated.', 'success')} 
            className="btn btn-primary"
          >
            Apply to Wallet
          </button>
        </div>
      </div>
    </div>
  );

  // RENDER NOTIFICATIONS
  const renderNotifications = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3>Latest Updates & Messages</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          { title: 'Big Billion Days Early Entry!', msg: 'As a Plus member, your early access catalogs open in 12 hours. Set up your cart now!', time: '2 hours ago', icon: <Sparkles size={18} style={{ color: '#ff9f00' }} /> },
          { title: 'Security Alert: Password changed', msg: 'The credential modifications to your account was registered successfully.', time: '1 day ago', icon: <ShieldCheck size={18} style={{ color: '#388e3c' }} /> },
          { title: 'Welcome to AuraShop!', msg: 'Start browsing our Flipkart themed light-layout categories for footwear, electronics, furniture, appliances and more.', time: '3 days ago', icon: <Bell size={18} style={{ color: '#2874f0' }} /> }
        ].map((notif, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{notif.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{notif.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{notif.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // RENDER ADVERTISE
  const renderAdvertise = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        padding: '50px 32px',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <TrendingUp size={48} style={{ color: '#ffffff' }} />
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Grow Your Brand Audience by 10x</h1>
        <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '1.05rem' }}>
          Drive instant discoverability and traffic with premium target campaigns across search keywords, banners, and carousels.
        </p>
        <button 
          onClick={() => triggerInteraction('Advertising consultation request filed! Agent will contact you.')} 
          className="btn" 
          style={{ background: '#ffffff', color: '#11998e', padding: '12px 30px', fontWeight: 700 }}
        >
          Create Ad Campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--accent-primary)' }}>Banner Sponsorships</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Premium placements on the HomePage top carousel, driving maximum eye-level brand impressions.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--accent-primary)' }}>Keyword Placements</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Boost your product listings in search pages when customers look for relevant product queries.
          </p>
        </div>
      </div>
    </div>
  );

  // RENDER CUSTOMER CARE
  const renderCustomerCare = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <HelpCircle size={40} style={{ color: 'var(--accent-primary)', marginBottom: '12px' }} />
        <h2>Welcome to Help & Support Portal</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Find answers, browse help manuals, or connect with our support agents instantly.
        </p>
      </div>

      <div>
        <h3>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          {[
            { q: 'How do I cancel or modify an active order?', a: 'You can cancel your order directly from the "Orders" page before it ships. Once shipped, it can only be returned after delivery.' },
            { q: 'What is the standard return policy?', a: 'Return time windows vary by category (usually 10-30 days). Make sure packaging, tags, and product remains original.' },
            { q: 'How do SuperCoins get credited?', a: 'SuperCoins get auto-credited within 7 days of successful delivery. Non-Plus members earn 2 coins per $100 spent.' }
          ].map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '16px', overflow: 'hidden' }}>
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '0.975rem',
                  color: 'var(--text-primary)'
                }}
              >
                <span>{faq.q}</span>
                <span>{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // RENDER NOTIFICATION SETTINGS
  const renderNotificationSettings = () => {
    const [toggles, setToggles] = useState({ orders: true, offers: false, wallet: true });
    return (
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <BellRing style={{ color: 'var(--accent-primary)' }} />
          <span>Notification Configurations</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { key: 'orders', title: 'Transactional Order Status Alerts', desc: 'SMS & Email notifications for dispatch, transit and delivery updates.' },
            { key: 'offers', title: 'Big Sales and Discount Deals Alerts', desc: 'Promotional updates for early-access deals and new launches.' },
            { key: 'wallet', title: 'Gift Voucher & Card Alerts', desc: 'Notifications on balance credit or card expiration warnings.' }
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
              <div style={{ maxWidth: '80%' }}>
                <h4 style={{ fontWeight: 600 }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              <button 
                onClick={() => {
                  setToggles({ ...toggles, [item.key]: !toggles[item.key] });
                  triggerInteraction(`Preferences updated!`);
                }}
                style={{
                  background: toggles[item.key] ? 'var(--accent-primary)' : 'var(--text-muted)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {toggles[item.key] ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // RENDER DOWNLOAD APP
  const renderDownloadApp = () => (
    <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Download size={36} style={{ color: 'var(--accent-primary)' }} />
        <h2>Install the Mobile Application</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Shop with faster loading protocols, exclusive daily mobile-only app deals, live push tracking notifications, and instant voice search interfaces.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => triggerInteraction('Android app downloading initiated...')} 
            className="btn btn-secondary" 
            style={{ display: 'flex', gap: '8px', padding: '10px 20px' }}
          >
            <Smartphone size={16} /> Google Play
          </button>
          <button 
            onClick={() => triggerInteraction('Apple App download initiated...')} 
            className="btn btn-secondary" 
            style={{ display: 'flex', gap: '8px', padding: '10px 20px' }}
          >
            <Smartphone size={16} /> App Store
          </button>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-primary)',
        padding: '24px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'center'
      }}>
        <QrCode size={120} style={{ color: '#212121' }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Scan QR to Download Now</span>
      </div>
    </div>
  );

  const getPageConfig = () => {
    switch (type) {
      case 'seller': return { title: 'Sell on AuraShop', render: renderSeller };
      case 'coupons': return { title: 'My Reward Coupons', render: renderCoupons };
      case 'supercoin': return { title: 'SuperCoin Zone', render: renderSupercoin };
      case 'plus': return { title: 'AuraShop Plus Membership', render: renderPlus };
      case 'wallet': return { title: 'Saved Cards & Wallet Balance', render: renderWallet };
      case 'addresses': return { title: 'Saved Addresses', render: renderAddresses };
      case 'giftcards': return { title: 'Gift Cards Center', render: renderGiftCards };
      case 'notifications': return { title: 'Notification Alerts', render: renderNotifications };
      case 'advertise': return { title: 'Advertise With AuraShop', render: renderAdvertise };
      case 'support': return { title: 'Customer Help Support', render: renderCustomerCare };
      case 'notification-preferences': return { title: 'Notification Preferences', render: renderNotificationSettings };
      case 'download-app': return { title: 'Download Mobile App', render: renderDownloadApp };
      default: return { title: 'Supplementary Center', render: () => <div>Page Content</div> };
    }
  };

  const config = getPageConfig();

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Header Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="flex-center" 
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '8px',
            borderRadius: '50%',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>RETURN BACK</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{config.title}</h1>
      </div>

      {/* Render selected component */}
      <section style={{ animation: 'slideIn 0.3s ease-out' }}>
        {config.render()}
      </section>
    </main>
  );
};

export default FlipkartPremiumPage;
