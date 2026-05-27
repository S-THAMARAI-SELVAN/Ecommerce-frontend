import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice.js';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlist(id));
    dispatch(addToast({ message: `Removed "${name}" from Wishlist`, type: 'info' }));
  };

  const handleMoveToCart = (item) => {
    dispatch(
      addToCart({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        countInStock: item.countInStock || 10,
        qty: 1,
      })
    );
    dispatch(addToast({ message: `Moved "${item.name}" to Cart!`, type: 'success' }));
  };

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart size={32} style={{ color: '#fb641b' }} fill="#fb641b" />
          <span>My Wishlist ({wishlistItems.length})</span>
        </h1>
        <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <Heart size={64} style={{ color: '#fb641b' }} />
          <h3>Your wishlist is currently empty!</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            Add items that you like to your wishlist so you can easily track and purchase them later.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {wishlistItems.map((item) => (
            <div key={item.product} className="glass-panel hover-scale" style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Delete Icon Badge */}
              <button 
                onClick={() => handleRemove(item.product, item.name)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  padding: '8px',
                  borderRadius: '50%',
                  color: 'var(--color-error)',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Trash2 size={16} />
              </button>

              {/* Product Image Link */}
              <Link to={`/product/${item.product}`} style={{ display: 'block', height: '240px', background: 'var(--bg-tertiary)' }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>

              {/* Card Details */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>{item.category}</span>
                <Link to={`/product/${item.product}`}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                </Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Star size={12} fill="#ff9f00" style={{ color: '#ff9f00' }} />
                  <span>{item.rating || '4.5'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    ₹{Math.floor(item.price).toLocaleString('en-IN')}
                  </span>
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
