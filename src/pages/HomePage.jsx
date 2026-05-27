import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';
import { 
  ShoppingBag, 
  Star, 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  Compass, 
  Heart, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Smartphone,
  Shirt,
  Laptop,
  Home,
  Tv,
  Gamepad2,
  Armchair
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel slide state
  const [currentSlide, setCurrentSlide] = useState(0);

  const { wishlistItems } = useSelector((state) => state.wishlist);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the API. Make sure the database is running and seeded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
    dispatch(
      addToast({
        message: `Successfully added "${product.name}" to your cart!`,
        type: 'success',
      })
    );
  };

  const toggleWishlist = (product) => {
    const isWishlisted = wishlistItems.some((item) => item.product === product._id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      dispatch(addToast({ message: `Removed "${product.name}" from Wishlist`, type: 'info' }));
    } else {
      dispatch(
        addToWishlist({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
          rating: product.rating
        })
      );
      dispatch(addToast({ message: `Added "${product.name}" to Wishlist!`, type: 'success' }));
    }
  };

  // Premium Category imagery using reliable lucide icons
  const FLIPKART_CATEGORIES = [
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Fashion', icon: Shirt },
    { name: 'Electronics', icon: Laptop },
    { name: 'Home', icon: Home },
    { name: 'Appliances', icon: Tv },
    { name: 'Toys', icon: Gamepad2 },
    { name: 'Furniture', icon: Armchair }
  ];

  // Mock advertising banners for slider
  const HERO_BANNERS = [
    {
      title: 'BIG BILLION SALE IS ON!',
      subtitle: 'Up to 80% Off on Mobiles & Laptops',
      cta: 'Shop Deals',
      bg: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=800&q=80',
      tagColor: '#ffe500'
    },
    {
      title: 'REFRESH YOUR HOME SPACE',
      subtitle: 'Premium Furniture & Home Decor from $49',
      cta: 'Explore Decor',
      bg: 'linear-gradient(135deg, #fb641b 0%, #d44d0d 100%)',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      tagColor: '#ffffff'
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '24px', paddingBottom: '60px' }}>
      
      {/* 1. AUTHENTIC DYNAMIC FLIPKART CATEGORY STRIP */}
      <section className="category-nav-bar">
        <div className="category-nav-container">
          {FLIPKART_CATEGORIES.map((cat) => (
            <div 
              key={cat.name} 
              className="category-nav-item"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f4faf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: 'var(--accent-primary)'
              }}>
                <cat.icon size={28} strokeWidth={1.5} />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. HIGH-FIDELITY AD SLIDER */}
      <section className="container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
        <div style={{
          background: HERO_BANNERS[currentSlide].bg,
          color: '#ffffff',
          padding: '48px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: '280px',
          borderRadius: '4px',
          position: 'relative',
          transition: 'all 0.5s ease-in-out',
          gap: '24px'
        }}>
          {/* Left Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '300px', zIndex: 2 }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: HERO_BANNERS[currentSlide].tagColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} fill="currentColor" /> SPECIAL OFFER
            </span>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              fontFamily: 'var(--font-sans)'
            }}>
              {HERO_BANNERS[currentSlide].title}
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, margin: '4px 0 16px' }}>
              {HERO_BANNERS[currentSlide].subtitle}
            </p>
            <Link to="/products" className="btn" style={{
              background: '#ffffff',
              color: '#212121',
              padding: '12px 28px',
              alignSelf: 'flex-start',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}>
              {HERO_BANNERS[currentSlide].cta}
            </Link>
          </div>

          {/* Right Banner Image */}
          <div style={{
            flex: 1,
            minWidth: '280px',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1,
            position: 'relative'
          }}>
            <img 
              src={HERO_BANNERS[currentSlide].image} 
              alt="Promotion"
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          {/* Slider controls */}
          <button 
            onClick={handlePrevSlide}
            style={{
              position: 'absolute',
              left: '12px',
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* 3. MARKETING USP SECTIONS (LIGHT SYSTEM) */}
      <section className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        zIndex: 5
      }}>
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Truck size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Complimentary Shipping</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automatic free delivery on orders above $100.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ShieldCheck size={24} style={{ color: '#388e3c', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Secure Transactions</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fully encrypted payments and safe user policies.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Compass size={24} style={{ color: '#ff9f00', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Premium Curated Brands</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Top electronics, appliances, and fashion items.</p>
          </div>
        </div>
      </section>

      {/* 4. "STILL LOOKING FOR THESE?" HORIZONTAL SWIPER SECTION */}
      <section className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Still looking for these?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Personalized recommendations matching your search index.</p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            padding: '10px 0',
            scrollbarWidth: 'thin'
          }} className="horizontal-swiper-scroll">
            {products.slice(0, 16).map((product) => {
              const isWishlisted = wishlistItems.some((w) => w.product === product._id);
              return (
                <div key={product._id} className="glass-panel hover-scale" style={{
                  minWidth: '220px',
                  maxWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Floating Heart Button */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '50%',
                      padding: '6px',
                      cursor: 'pointer',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Heart size={14} fill={isWishlisted ? '#fb641b' : 'none'} style={{ color: isWishlisted ? '#fb641b' : 'var(--text-muted)' }} />
                  </button>

                  {/* Thumbnail Image */}
                  <Link to={`/product/${product._id}`} style={{ display: 'block', height: '140px', background: 'var(--bg-tertiary)' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Product Details */}
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {product.category}
                    </span>
                    <Link to={`/product/${product._id}`}>
                      <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2
                      }}>
                        {product.name}
                      </h4>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Star size={10} fill="#ff9f00" style={{ color: '#ff9f00' }} />
                      <span>{product.rating}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{Math.floor(product.price).toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        style={{
                          background: 'var(--accent-primary)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        + Buy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. FEATURED PRODUCTS SECTION */}
      <section className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Top Deals of the Day</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Curated premium items with massive savings right now.</p>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <p style={{ color: 'var(--color-error)', marginBottom: '16px', fontWeight: 500 }}>{error}</p>
            <button onClick={fetchProducts} className="btn btn-secondary">Try Refreshing</button>
          </div>
        ) : (
          <div className="grid-catalog">
            {products.slice(16, 40).map((product) => {
              const isWishlisted = wishlistItems.some((w) => w.product === product._id);
              return (
                <div key={product._id} className="glass-panel hover-scale" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Floating Wishlist Heart */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Heart size={16} fill={isWishlisted ? '#fb641b' : 'none'} style={{ color: isWishlisted ? '#fb641b' : 'var(--text-muted)' }} />
                  </button>

                  {/* Image Wrap */}
                  <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', height: '220px', background: 'var(--bg-tertiary)' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-slow)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </Link>

                  {/* Body details */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {product.category}
                    </span>
                    <Link to={`/product/${product._id}`}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 600, 
                        lineHeight: 1.3, 
                        color: 'var(--text-primary)' 
                      }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                        {product.name}
                      </h3>
                    </Link>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>
                      {product.description.substring(0, 80)}...
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Star size={12} fill="#ff9f00" style={{ color: '#ff9f00' }} />
                      <span>{product.rating} ({product.numReviews} Reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContainer: 'space-between', marginTop: '10px', width: '100%' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', flex: 1 }}>
                        ₹{Math.floor(product.price).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        disabled={product.countInStock === 0}
                      >
                        <ShoppingBag size={14} />
                        <span>{product.countInStock > 0 ? 'Buy Now' : 'Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
};

export default HomePage;
