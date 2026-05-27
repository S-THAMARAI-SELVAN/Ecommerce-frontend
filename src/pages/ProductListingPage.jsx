import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';
import { Search, ShoppingBag, Star, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import { Link } from 'react-router-dom';

const ProductListingPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI filter parameters states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Form query parameters
      const params = {};
      const queryKeyword = searchParams.get('keyword');
      if (queryKeyword) params.keyword = queryKeyword;

      const { data } = await api.get('/api/products', { params });
      
      // Inject category filtering manually on client side if in resilient demo mode,
      // or to ensure fast, robust queries under offline states.
      let filteredData = data;
      const queryCategory = searchParams.get('category');
      if (queryCategory && queryCategory !== 'All') {
        filteredData = data.filter(p => p.category.toLowerCase() === queryCategory.toLowerCase());
      }

      setProducts(filteredData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch the catalog.');
    } finally {
      setLoading(false);
    }
  };

  // Sync state parameters with query parameters changes
  useEffect(() => {
    const keywordParam = searchParams.get('keyword') || '';
    const categoryParam = searchParams.get('category') || 'All';
    setKeyword(keywordParam);
    setCategory(categoryParam);
    fetchProducts();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (category && category !== 'All') newParams.category = category;
    setSearchParams(newParams);
  };

  const handleCategorySelect = (selectedCat) => {
    const newParams = {};
    const currentKeyword = searchParams.get('keyword');
    if (currentKeyword) newParams.keyword = currentKeyword;
    if (selectedCat !== 'All') newParams.category = selectedCat;
    setSearchParams(newParams);
  };

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

  // Sorting logics
  const getSortedProducts = () => {
    const productsCopy = [...products];
    switch (sortBy) {
      case 'price-low-high':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'rating':
        return productsCopy.sort((a, b) => b.rating - a.rating);
      default:
        return productsCopy;
    }
  };

  const CATEGORIES = ['All', 'Mobiles', 'Fashion', 'Electronics', 'Home', 'Appliances', 'Toys', 'Furniture'];
  const sortedProductsList = getSortedProducts();

  return (
    <main className="container" style={{ padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Search Header Banner */}
      <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '6px' }}>
            {category === 'All' ? 'Complete Collection' : `${category} Curations`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {products.length} Products match your parameters
          </p>
        </div>

        {/* Live Filter Controls */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search Mobiles, Fashion, Electronics..." 
              className="form-input" 
              style={{ width: '100%', paddingLeft: '48px' }} 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            Search
          </button>
        </form>
      </section>

      {/* Main Split Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
        alignItems: 'start'
      }} className="listing-layout-query">
        
        {/* Left Side: Sidebar Filter Panels */}
        <aside className="glass-panel" style={{
          padding: '28px',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          
          {/* Categories Filter Block */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} />
              <span>Category</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CATEGORIES.map((cat) => (
                <button
                   key={cat}
                   onClick={() => handleCategorySelect(cat)}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     padding: '10px 14px',
                     borderRadius: 'var(--radius-sm)',
                     fontSize: '0.925rem',
                     fontWeight: category === cat ? 600 : 500,
                     background: category === cat ? 'var(--accent-primary)' : 'var(--bg-primary)',
                     border: '1px solid',
                     borderColor: category === cat ? 'var(--accent-primary)' : 'rgba(0,0,0,0.06)',
                     color: category === cat ? '#fff' : 'var(--text-primary)',
                     transition: 'all var(--transition-fast)',
                     textAlign: 'left'
                   }}
                   onMouseEnter={(e) => {
                     if (category !== cat) e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                   }}
                   onMouseLeave={(e) => {
                     if (category !== cat) e.currentTarget.style.background = 'var(--bg-primary)';
                   }}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Filter Block */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              Sort Results
            </h3>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                width: '100%',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <option value="default">Default Catalog</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>

          {/* Quick catalog refresh */}
          <button onClick={fetchProducts} style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <RefreshCw size={12} /> Sync Online Catalog
          </button>
        </aside>

        {/* Right Side: Product grid results */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <p style={{ color: 'var(--color-error)', marginBottom: '16px', fontWeight: 500 }}>{error}</p>
              <button onClick={fetchProducts} className="btn btn-secondary">Try Again</button>
            </div>
          ) : sortedProductsList.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>No items discovered</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                We could not discover any product matching your specifications.
              </p>
              <button onClick={() => setSearchParams({})} className="btn btn-secondary">Reset Filters</button>
            </div>
          ) : (
            <div className="grid-catalog" style={{ margin: 0 }}>
              {sortedProductsList.map((product) => (
                <div key={product._id} className="glass-panel hover-scale" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  {/* Image wrapper */}
                  <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', height: '220px', background: 'var(--bg-tertiary)', position: 'relative' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-slow)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(40, 116, 240, 0.95)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#fff'
                    }}>{product.category}</span>
                  </Link>

                  {/* Body description */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                    <Link to={`/product/${product._id}`}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                        {product.name}
                      </h3>
                    </Link>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>
                      {product.description.substring(0, 80)}...
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', color: 'var(--accent-secondary)' }}>
                        <Star size={12} fill="currentColor" style={{ color: '#ff9f00' }} />
                      </div>
                      <span>{product.rating} ({product.numReviews} Reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                        ₹{Math.floor(product.price).toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        disabled={product.countInStock === 0}
                      >
                        <ShoppingBag size={12} />
                        <span>{product.countInStock > 0 ? 'Buy' : 'Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .listing-layout-query {
            grid-template-columns: 260px 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default ProductListingPage;
