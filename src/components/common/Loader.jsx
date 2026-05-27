import React from 'react';

const Loader = ({ size = '40px', color = 'var(--accent-primary)' }) => {
  return (
    <div className="flex-center" style={{ padding: '40px 0', width: '100%' }}>
      <div 
        className="spinner" 
        style={{ 
          width: size, 
          height: size, 
          borderTopColor: color 
        }} 
      />
    </div>
  );
};

export default Loader;
