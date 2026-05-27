import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice.js';
import { addToast } from '../features/toast/toastSlice.js';
import api from '../services/api.js';
import { Shield, Check, MapPin, Truck, ChevronRight, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Check if this was a "BUY NOW" click (direct purchase) or standard cart checkout
  const isDirectBuy = location.state?.isDirectBuy || false;
  const checkoutItems = isDirectBuy ? (location.state?.checkoutItems || []) : cartItems;

  // Step 1: Address, Step 2: Order Summary, Step 3: Payment
  const [currentStep, setCurrentStep] = useState(2); // Start at Order Summary as in the user screenshot
  
  // Shipping Address State
  const [address, setAddress] = useState({
    name: userInfo?.name || 'Thamarai Selvan',
    address: 'C-block, Kondampatty, Near Sri Eshwar College Of Engineering (Boys Hostel)',
    city: 'Coimbatore',
    postalCode: '641202',
    country: 'India',
    phone: '9042963306'
  });
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState({ ...address });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // If no items, redirect
  if (checkoutItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', background: '#f1f3f6', minHeight: '80vh' }}>
        <div style={{ background: '#fff', padding: '40px', maxWidth: '600px', margin: '0 auto', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <h2>No items for checkout</h2>
          <p style={{ color: '#878787', margin: '16px 0 24px 0' }}>Your cart is empty and no direct product purchase was initiated.</p>
          <Link to="/" style={{ background: '#2874f0', color: '#fff', padding: '12px 24px', textDecoration: 'none', fontWeight: 600, borderRadius: '2px' }}>GO SHOPPING</Link>
        </div>
      </div>
    );
  }

  // Calculations
  const rawPrice = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const mrpPrice = Math.floor(rawPrice * 1.58);
  const discountAmount = mrpPrice - Math.floor(rawPrice);
  const deliveryFee = 40;
  const isFreeDelivery = rawPrice > 500;
  const totalAmount = Math.floor(rawPrice) + (isFreeDelivery ? 0 : deliveryFee);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddress({ ...editedAddress });
    setIsEditingAddress(false);
    dispatch(addToast({ message: 'Delivery address updated!', type: 'success' }));
  };

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        orderItems: checkoutItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress: {
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country
        },
        paymentMethod: paymentMethod,
        itemsPrice: Number(rawPrice.toFixed(2)),
        shippingPrice: isFreeDelivery ? 0 : deliveryFee,
        taxPrice: 0,
        totalPrice: Number(totalAmount.toFixed(2))
      };

      const { data } = await api.post('/api/orders', orderPayload);
      
      dispatch(addToast({ message: 'Order placed successfully!', type: 'success' }));
      
      // If it was standard checkout, clear cart
      if (!isDirectBuy) {
        dispatch(clearCart());
      }
      
      // Navigate to orders
      navigate('/orders');
    } catch (err) {
      console.error(err);
      dispatch(addToast({ 
        message: err.response?.data?.message || 'Failed to place order. Try again.', 
        type: 'error' 
      }));
    }
  };

  return (
    <main style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 3-Step Checkout Steps Indicator */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '16px 0', marginBottom: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
          
          {/* Step 1: Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(1)}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: currentStep >= 1 ? '#2874f0' : '#878787',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {currentStep > 1 ? <Check size={14} /> : '1'}
            </div>
            <span style={{ 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              color: currentStep >= 1 ? '#212121' : '#878787',
              textTransform: 'uppercase'
            }}>Address</span>
          </div>

          <div style={{ width: '80px', height: '2px', background: currentStep >= 2 ? '#2874f0' : '#ddd' }}></div>

          {/* Step 2: Order Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(2)}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: currentStep >= 2 ? '#2874f0' : '#878787',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {currentStep > 2 ? <Check size={14} /> : '2'}
            </div>
            <span style={{ 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              color: currentStep >= 2 ? '#212121' : '#878787',
              textTransform: 'uppercase'
            }}>Order Summary</span>
          </div>

          <div style={{ width: '80px', height: '2px', background: currentStep >= 3 ? '#2874f0' : '#ddd' }}></div>

          {/* Step 3: Payment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(3)}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: currentStep >= 3 ? '#2874f0' : '#878787',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              3
            </div>
            <span style={{ 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              color: currentStep >= 3 ? '#212121' : '#878787',
              textTransform: 'uppercase'
            }}>Payment</span>
          </div>

        </div>
      </div>

      <div className="container checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', padding: '0 24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* STEP 1 BLOCK: Address Card */}
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '2px' }}>
            <div style={{ background: '#2874f0', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#fff', color: '#2874f0', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Delivery Address</span>
              </div>
              {currentStep !== 1 && (
                <button 
                  onClick={() => setCurrentStep(1)} 
                  style={{ background: '#fff', border: '1px solid #e0e0e0', color: '#2874f0', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, borderRadius: '2px', cursor: 'pointer' }}
                >
                  CHANGE
                </button>
              )}
            </div>

            {currentStep === 1 ? (
              <div style={{ padding: '20px' }}>
                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="Name" 
                        required
                        value={editedAddress.name} 
                        onChange={(e) => setEditedAddress({ ...editedAddress, name: e.target.value })}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        required
                        value={editedAddress.phone} 
                        onChange={(e) => setEditedAddress({ ...editedAddress, phone: e.target.value })}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </div>
                    <textarea 
                      placeholder="Address Line" 
                      required
                      value={editedAddress.address} 
                      onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })}
                      style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '2px', height: '80px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="City" 
                        required
                        value={editedAddress.city} 
                        onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Postal Code" 
                        required
                        value={editedAddress.postalCode} 
                        onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button type="submit" style={{ background: '#fb641b', color: '#fff', padding: '10px 24px', border: 'none', fontWeight: 600, cursor: 'pointer', borderRadius: '2px' }}>SAVE AND DELIVER HERE</button>
                      <button type="button" onClick={() => setIsEditingAddress(false)} style={{ background: '#fff', border: '1px solid #ccc', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', borderRadius: '2px' }}>CANCEL</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#212121' }}>{address.name}</span>
                      <span style={{ background: '#f0f0f0', padding: '2px 6px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 600, color: '#878787' }}>HOME</span>
                      <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{address.phone}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5, marginBottom: '16px' }}>
                      {address.address}, {address.city}, Tamil Nadu - <strong style={{ color: '#212121' }}>{address.postalCode}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => {
                          setEditedAddress({ ...address });
                          setIsEditingAddress(true);
                        }} 
                        style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', borderRadius: '2px' }}
                      >
                        EDIT ADDRESS
                      </button>
                      <button 
                        onClick={() => setCurrentStep(2)} 
                        style={{ background: '#2874f0', color: '#fff', border: 'none', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', borderRadius: '2px' }}
                      >
                        DELIVER HERE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>{address.name}</span> &nbsp;|&nbsp; <span>{address.address}, {address.postalCode}</span>
              </div>
            )}
          </div>

          {/* STEP 2 BLOCK: Order Summary Card */}
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '2px' }}>
            <div style={{ background: currentStep === 2 ? '#2874f0' : '#fafafa', color: currentStep === 2 ? '#fff' : '#878787', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ background: currentStep === 2 ? '#fff' : '#f0f0f0', color: currentStep === 2 ? '#2874f0' : '#878787', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', color: currentStep === 2 ? '#fff' : '#212121' }}>Order Summary</span>
            </div>

            {currentStep === 2 && (
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {checkoutItems.map((item, idx) => {
                    const origPrice = Math.floor(item.price * 1.58);
                    const discPercent = 58;
                    const itemColorFilter = item.color?.filter || 'none';
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: idx === checkoutItems.length - 1 ? 'none' : '1px solid #f0f0f0', paddingBottom: '16px' }}>
                        <div style={{ width: '80px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0', padding: '4px' }}>
                          <img 
                            src={item.image} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: itemColorFilter }} 
                            alt={item.name} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#212121', marginBottom: '4px' }}>{item.name}</h4>
                          {item.size && (
                            <div style={{ fontSize: '0.8rem', color: '#878787', marginBottom: '6px' }}>
                              Size: <strong>{item.size}</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>₹{Math.floor(item.price).toLocaleString('en-IN')}</span>
                            <span style={{ textDecoration: 'line-through', color: '#878787', fontSize: '0.85rem' }}>₹{Math.floor(origPrice).toLocaleString('en-IN')}</span>
                            <span style={{ color: '#388e3c', fontSize: '0.85rem', fontWeight: 600 }}>{discPercent}% Off</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#878787' }}>
                            Quantity: <strong>{item.qty}</strong>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 500 }}>Delivery by Tue, Jun 2</div>
                          <div style={{ color: '#388e3c', marginTop: '4px', fontSize: '0.8rem' }}>Free Delivery <span style={{ textDecoration: 'line-through', color: '#878787' }}>₹40</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>
                    Order confirmation email will be sent to <strong>{userInfo?.email || 'user@example.com'}</strong>
                  </span>
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '12px 32px', fontWeight: 600, fontSize: '0.95rem', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3 BLOCK: Payment Card */}
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '2px' }}>
            <div style={{ background: currentStep === 3 ? '#2874f0' : '#fafafa', color: currentStep === 3 ? '#fff' : '#878787', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: currentStep === 3 ? '#fff' : '#f0f0f0', color: currentStep === 3 ? '#2874f0' : '#878787', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>3</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', color: currentStep === 3 ? '#fff' : '#212121' }}>Payment Options</span>
            </div>

            {currentStep === 3 && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  
                  {['Google Pay / UPI', 'Credit / Debit / ATM Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', background: paymentMethod === method ? '#f7faff' : '#fff', borderColor: paymentMethod === method ? '#2874f0' : '#e0e0e0' }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} color={paymentMethod === method ? '#2874f0' : '#878787'} />
                        <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#212121' }}>{method}</span>
                      </div>
                    </label>
                  ))}
                  
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={handlePlaceOrder}
                    style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '14px 40px', fontWeight: 600, fontSize: '1rem', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                  >
                    CONFIRM ORDER (₹{Math.floor(totalAmount).toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Price Details Sidebar */}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '2px', position: 'sticky', top: '80px' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#878787', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            Price Details
          </div>
          
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#212121' }}>
              <span>Price ({checkoutItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span>₹{Math.floor(mrpPrice).toLocaleString('en-IN')}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#388e3c', fontWeight: 500 }}>
              <span>Discount</span>
              <span>- ₹{Math.floor(discountAmount).toLocaleString('en-IN')}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#212121' }}>
              <span>Delivery Charges</span>
              <span>
                {isFreeDelivery ? (
                  <span style={{ color: '#388e3c' }}>FREE <span style={{ textDecoration: 'line-through', color: '#878787' }}>₹40</span></span>
                ) : (
                  '₹40'
                )}
              </span>
            </div>

            <div style={{ borderTop: '1px dotted #d0d0d0', borderBottom: '1px dotted #d0d0d0', padding: '16px 0', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#212121' }}>
              <span>Total Amount</span>
              <span>₹{Math.floor(totalAmount).toLocaleString('en-IN')}</span>
            </div>

            <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '0.9rem', background: '#edfbf1', padding: '10px 12px', borderRadius: '2px', border: '1px solid #c8e6c9', textAlign: 'center' }}>
              You will save ₹{Math.floor(discountAmount).toLocaleString('en-IN')} on this order
            </div>
          </div>

          <div style={{ background: '#fafafa', padding: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px', color: '#878787', fontSize: '0.85rem' }}>
            <Shield size={24} style={{ color: '#878787', flexShrink: 0 }} />
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>

      </div>

      <style>{`
        .checkout-layout {
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 16px;
        }
        @media (min-width: 992px) {
          .checkout-layout {
            grid-template-columns: 2.2fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default CheckoutPage;
