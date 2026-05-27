import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const updateQtyHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
  };

  const removeFromCartHandler = (id, name) => {
    dispatch(removeFromCart(id));
    dispatch(addToast({ message: `${name} removed from cart`, type: 'info' }));
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
    dispatch(addToast({ message: 'Cart cleared', type: 'info' }));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShoppingCart size={28} style={{ color: 'var(--accent-primary)' }} />
        <span>Shopping Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Before checking out, you must add some premium items to your cart.
          </p>
          <Link to="/" className="btn btn-primary" style={{ gap: '8px' }}>
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
          alignItems: 'start'
        }} className="cart-layout-query">
          {/* Cart items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div key={item.product} className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                background: 'rgba(20, 24, 33, 0.5)'
              }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    ₹{Math.floor(item.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Quantity Controller */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={item.qty} 
                    onChange={(e) => updateQtyHandler(item, e.target.value)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {[...Array(item.countInStock || 10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeFromCartHandler(item.product, item.name)}
                  style={{
                    color: 'var(--text-muted)',
                    padding: '8px',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button 
                onClick={clearCartHandler}
                style={{ color: 'var(--color-error)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Pricing Order Summary panel */}
          <div className="glass-panel" style={{
            padding: '32px',
            background: 'rgba(13, 16, 23, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              Order Summary
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} Items)</span>
                <span>₹{Math.floor(itemsPrice).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `₹${Math.floor(shippingPrice).toLocaleString('en-IN')}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>₹{Math.floor(taxPrice).toLocaleString('en-IN')}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 700,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '16px',
                marginTop: '8px',
                color: '#fff'
              }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--accent-secondary)' }}>₹{Math.floor(totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              onClick={checkoutHandler}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '12px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @media (min-width: 900px) {
          .cart-layout-query {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default CartPage;
