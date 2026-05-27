import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice.js';
import { Star, ShoppingBag, ArrowLeft, Send, CheckCircle, Heart, Share2, MapPin, Tag, Truck } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  // Component states
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('8');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState('User Location');
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        
        // Fetch similar products
        const { data: allProducts } = await api.get('/api/products');
        const similar = allProducts.filter(p => p.category === data.category && p._id !== data._id).slice(0, 10);
        setSimilarProducts(similar);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Could not fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    // Scroll to top on id change
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
      })
    );
    dispatch(
      addToast({
        message: `Successfully added to cart!`,
        type: 'success',
      })
    );
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        checkoutItems: [{
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: Number(qty),
          color: colors[selectedColor],
          size: product.category === 'Fashion' ? selectedSize : null
        }],
        isDirectBuy: true
      }
    });
  };

  const toggleWishlist = (prod) => {
    const isWishlisted = wishlistItems.some((item) => item.product === prod._id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(prod._id));
      dispatch(addToast({ message: `Removed from Wishlist`, type: 'info' }));
    } else {
      dispatch(addToWishlist({ ...prod, product: prod._id }));
      dispatch(addToast({ message: `Added to Wishlist!`, type: 'success' }));
    }
  };

  if (loading) return <Loader size="50px" />;
  if (error) return <div style={{textAlign: 'center', padding: '100px'}}>{error}</div>;
  if (!product) return null;

  const isWishlisted = wishlistItems.some((w) => w.product === product._id);
  const originalPrice = Math.floor(product.price * 1.58); // Simulate 58% higher original price
  const discountPercent = 58;
  const currentPrice = Math.floor(product.price);
  
  // Simulate multiple product shots using slight CSS variations of the single image
  const imageVariants = [
    { url: product.image, filter: 'none', transform: 'none' },
    { url: product.image, filter: 'brightness(1.05)', transform: 'scale(1.1)' },
    { url: product.image, filter: 'contrast(1.1)', transform: 'scaleX(-1)' },
    { url: product.image, filter: 'saturate(1.2)', transform: 'none' }
  ];

  // Colors array for color selector
  const colors = [
    { name: 'Original', filter: 'none' },
    { name: 'Alternative', filter: 'hue-rotate(180deg) saturate(1.5)' },
    { name: 'Grayscale', filter: 'grayscale(100%)' }
  ];

  const getCombinedFilter = (vFilter, cFilter) => {
    let res = '';
    if (vFilter && vFilter !== 'none') res += vFilter + ' ';
    if (cFilter && cFilter !== 'none') res += cFilter;
    return res.trim() || 'none';
  };

  return (
    <main style={{ background: '#f1f3f6', paddingBottom: '40px', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <div style={{ padding: '12px 24px', background: '#fff', fontSize: '0.8rem', color: '#878787', borderBottom: '1px solid #f0f0f0' }}>
        <Link to="/" style={{color: '#878787'}}>Home</Link> / {product.category} / {product.brand} / {product.name}
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '40% 1fr', gap: '16px', padding: '16px 24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Gallery */}
        <div style={{ background: '#fff', padding: '16px', position: 'relative', border: '1px solid #f0f0f0' }}>
          
          <button 
            onClick={() => toggleWishlist(product)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <Heart size={18} fill={isWishlisted ? '#ff4343' : '#c2c2c2'} style={{ color: isWishlisted ? '#ff4343' : '#c2c2c2' }} />
          </button>
          
          <div style={{ display: 'flex', gap: '12px', height: '450px' }}>
            {/* Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '64px' }}>
              {imageVariants.map((variant, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  style={{ width: '64px', height: '64px', border: activeImageIndex === idx ? '2px solid #2874f0' : '1px solid #f0f0f0', cursor: 'pointer', overflow: 'hidden' }}
                >
                  <img src={variant.url} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: getCombinedFilter(variant.filter, colors[selectedColor].filter), transform: variant.transform }} alt="thumb" />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div style={{ flex: 1, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
              <img 
                src={imageVariants[activeImageIndex].url} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: getCombinedFilter(imageVariants[activeImageIndex].filter, colors[selectedColor].filter), transform: imageVariants[activeImageIndex].transform, transition: 'all 0.3s ease' }} 
                alt={product.name} 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button 
              onClick={handleAddToCart}
              style={{ flex: 1, padding: '18px', background: '#ff9f00', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
            >
              <ShoppingBag size={18} /> ADD TO CART
            </button>
            <button 
              onClick={handleBuyNow}
              style={{ flex: 1, padding: '18px', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
            >
              BUY NOW
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div style={{ background: '#fff', padding: '24px', border: '1px solid #f0f0f0' }}>
          
          <div style={{ fontSize: '1.15rem', color: '#212121', marginBottom: '8px', fontWeight: 500 }}>
            {product.name}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ background: '#388e3c', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {product.rating.toFixed(1)} <Star size={10} fill="#fff" />
            </div>
            <div style={{ color: '#878787', fontSize: '0.9rem', fontWeight: 500 }}>
              {product.numReviews} Ratings & Reviews
            </div>
          </div>

          <div style={{ color: '#388e3c', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
            Lowest Price since Launch
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#212121' }}>₹{Math.floor(currentPrice).toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '1rem', color: '#878787', textDecoration: 'line-through' }}>₹{Math.floor(originalPrice).toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '1rem', color: '#388e3c', fontWeight: 600 }}>{discountPercent}% off</span>
          </div>

          {/* Offers */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Available offers</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '8px' }}><Tag size={16} color="#388e3c" style={{flexShrink: 0}} /> <span><strong>Bank Offer</strong> 5% Cashback on Flipkart Axis Bank Card</span></div>
              <div style={{ display: 'flex', gap: '8px' }}><Tag size={16} color="#388e3c" style={{flexShrink: 0}} /> <span><strong>Special Price</strong> Get extra 10% off (price inclusive of cashback/coupon)</span></div>
              <div style={{ display: 'flex', gap: '8px' }}><Tag size={16} color="#388e3c" style={{flexShrink: 0}} /> <span><strong>Partner Offer</strong> Sign-up for Pay Later & get free Times Prime Benefits</span></div>
            </div>
          </div>

          {/* Variations (Mock) */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '32px' }}>
            <div style={{ color: '#878787', width: '80px', fontSize: '0.9rem', fontWeight: 500 }}>Color</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {colors.map((c, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  style={{ width: '56px', height: '56px', border: selectedColor === idx ? '2px solid #2874f0' : '1px solid #f0f0f0', padding: '2px', cursor: 'pointer' }}
                >
                  <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: c.filter }} alt={c.name} />
                </div>
              ))}
            </div>
          </div>

          {product.category === 'Fashion' && (
            <div style={{ marginTop: '24px', display: 'flex', gap: '32px' }}>
              <div style={{ color: '#878787', width: '80px', fontSize: '0.9rem', fontWeight: 500 }}>Size</div>
              <div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['6', '7', '8', '9', '10'].map(size => (
                    <div 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{ 
                        width: '40px', height: '40px', 
                        border: selectedSize === size ? '2px solid #2874f0' : '1px solid #e0e0e0',
                        color: selectedSize === size ? '#2874f0' : '#212121',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                        borderRadius: '2px'
                      }}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delivery */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '32px' }}>
            <div style={{ color: '#878787', width: '80px', fontSize: '0.9rem', fontWeight: 500 }}>Delivery</div>
            <div style={{ flex: 1 }}>
              {isEditingLocation ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '2px solid #2874f0', paddingBottom: '4px', width: 'fit-content', marginBottom: '12px' }}>
                  <MapPin size={16} color="#2874f0" />
                  <input 
                    type="text" 
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    onBlur={() => setIsEditingLocation(false)}
                    onKeyDown={(e) => { if(e.key === 'Enter') setIsEditingLocation(false); }}
                    autoFocus
                    style={{ border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 500, color: '#2874f0', background: 'transparent' }}
                  />
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingLocation(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '2px solid #2874f0', paddingBottom: '4px', width: 'fit-content', marginBottom: '12px', cursor: 'pointer' }}
                >
                  <MapPin size={16} color="#2874f0" />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#2874f0' }}>Delivery to: {deliveryLocation}</span>
                </div>
              )}
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Delivery by 2 Jun, Tue | Free <span style={{ color: '#878787', textDecoration: 'line-through', fontWeight: 'normal' }}>₹40</span></div>
              <div style={{ color: '#878787', fontSize: '0.85rem', marginTop: '4px' }}>if ordered before 4:00 PM</div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '32px' }}>
            <div style={{ color: '#878787', width: '80px', fontSize: '0.9rem', fontWeight: 500 }}>Seller</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#2874f0', fontWeight: 600, fontSize: '0.95rem' }}>GaylaxyStore</span>
                <div style={{ background: '#2874f0', color: '#fff', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  4.4 <Star size={8} fill="#fff" />
                </div>
              </div>
              <ul style={{ color: '#212121', fontSize: '0.9rem', marginTop: '8px', paddingLeft: '16px' }}>
                <li>10 Days Return Policy</li>
                <li>GST invoice available</li>
              </ul>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '32px' }}>
            <div style={{ color: '#878787', width: '80px', fontSize: '0.9rem', fontWeight: 500 }}>Description</div>
            <div style={{ flex: 1, fontSize: '0.9rem', color: '#212121', lineHeight: '1.5' }}>
              {product.description}
            </div>
          </div>

        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="container" style={{ marginTop: '16px', background: '#fff', padding: '24px', border: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '20px' }}>Similar Products</div>
        
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'thin' }}>
          {similarProducts.map((p) => {
            const pWishlisted = wishlistItems.some((w) => w.product === p._id);
            return (
              <div key={p._id} style={{ minWidth: '200px', maxWidth: '200px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '16px', position: 'relative', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => navigate(`/product/${p._id}`)}>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 2 }}
                >
                  <Heart size={16} fill={pWishlisted ? '#ff4343' : 'none'} style={{ color: pWishlisted ? '#ff4343' : '#c2c2c2' }} />
                </button>
                <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <img src={p.image} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt={p.name} />
                </div>
                <div>
                  <div style={{ color: '#878787', fontSize: '0.8rem', fontWeight: 600 }}>{p.brand}</div>
                  <div style={{ fontSize: '0.9rem', color: '#212121', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }} title={p.name}>{p.name}</div>
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>₹{Math.floor(p.price).toLocaleString('en-IN')}</span>
                    <span style={{ color: '#878787', textDecoration: 'line-through', fontSize: '0.8rem' }}>₹{Math.floor(p.price * 1.58).toLocaleString('en-IN')}</span>
                    <span style={{ color: '#388e3c', fontSize: '0.8rem', fontWeight: 600 }}>58% off</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        ::-webkit-scrollbar {
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
      `}</style>
    </main>
  );
};

export default ProductPage;
