import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../features/toast/toastSlice.js';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastCard = ({ toast }) => {
  const dispatch = useDispatch();
  const { id, message, type } = toast;

  // Auto-remove toast bubble after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  // Determine icon based on alert type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />;
      case 'error':
        return <AlertTriangle size={18} style={{ color: 'var(--color-error)' }} />;
      default:
        return <Info size={18} style={{ color: 'var(--accent-secondary)' }} />;
    }
  };

  return (
    <div className={`glass-panel hover-scale`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px 20px',
      minWidth: '320px',
      maxWidth: '420px',
      background: type === 'success' ? '#e8f7ee' : 'rgba(15, 20, 28, 0.95)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      border: type === 'success' ? '1px solid #a3e2bb' : '1px solid rgba(255,255,255,0.08)',
      borderLeft: `4px solid ${
        type === 'success'
          ? 'var(--color-success)'
          : type === 'error'
          ? 'var(--color-error)'
          : 'var(--accent-secondary)'
      }`,
      pointerEvents: 'auto'
    }}>
      <div className="flex-center">{getIcon()}</div>
      
      <p style={{
        fontSize: '0.925rem',
        fontWeight: 600,
        color: type === 'success' ? '#1b5e20' : '#ffffff',
        margin: 0,
        flex: 1,
        lineHeight: 1.4
      }}>
        {message}
      </p>

      {/* Manual close X button */}
      <button 
        onClick={() => dispatch(removeToast(id))}
        style={{
          color: type === 'success' ? '#2e7d32' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          transition: 'color var(--transition-fast)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = type === 'success' ? '#1b5e20' : '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = type === 'success' ? '#2e7d32' : 'var(--text-muted)'}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useSelector((state) => state.toast);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none' // Allows clicking elements behind container gaps
    }}>
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
export { ToastCard };
