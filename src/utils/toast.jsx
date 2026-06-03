import { toast } from 'react-toastify';

// ─── Shared Icon Styles ──────────────────────────────────────────────────────
const icons = {
  success: '✦',
  error: '✖',
  info: '॰',
  warning: '⚠',
  cart: '🛍',
  order: '🪔',
  whatsapp: '📿',
  review: '🌸',
};

// ─── Base Style Builder ──────────────────────────────────────────────────────
const base = (bg, border, color, accent) => ({
  style: {
    background: bg,
    color: color,
    border: `1px solid ${border}`,
    borderLeft: `4px solid ${accent}`,
    fontFamily: '"EB Garamond", Georgia, serif',
    fontSize: '13px',
    letterSpacing: '0.02em',
    borderRadius: '16px',
    padding: '14px 18px',
    boxShadow: `0 8px 32px ${accent}25, 0 2px 8px rgba(0,0,0,0.08)`,
    maxWidth: '360px',
  },
  progressStyle: { background: accent },
  icon: false,
});

// ─── Toast Variants ──────────────────────────────────────────────────────────

/** Maroon success — e.g. Added to cart, Order placed */
export const toastSuccess = (msg, options = {}) =>
  toast.success(
    <div className="flex items-start gap-3">
      <span style={{ color: '#D4AF37', fontSize: '18px', lineHeight: 1 }}>{options.icon || icons.success}</span>
      <span>{msg}</span>
    </div>,
    {
      ...base('#FDFBF7', '#D4AF3740', '#2D1B10', '#800000'),
      ...options,
    }
  );

/** Crimson error — e.g. Form validation, server errors */
export const toastError = (msg, options = {}) =>
  toast.error(
    <div className="flex items-start gap-3">
      <span style={{ color: '#C62828', fontSize: '18px', lineHeight: 1 }}>{options.icon || icons.error}</span>
      <span>{msg}</span>
    </div>,
    {
      ...base('#FFF5F5', '#C6282830', '#7B1010', '#C62828'),
      ...options,
    }
  );

/** Gold info — e.g. Coming soon, status updates */
export const toastInfo = (msg, options = {}) =>
  toast.info(
    <div className="flex items-start gap-3">
      <span style={{ color: '#B8860B', fontSize: '18px', lineHeight: 1 }}>{options.icon || icons.info}</span>
      <span>{msg}</span>
    </div>,
    {
      ...base('#FFFBF0', '#D4AF3740', '#5D3F00', '#D4AF37'),
      ...options,
    }
  );

/** Amber warning — e.g. Incomplete form, low stock */
export const toastWarning = (msg, options = {}) =>
  toast.warning(
    <div className="flex items-start gap-3">
      <span style={{ color: '#E65100', fontSize: '18px', lineHeight: 1 }}>{options.icon || icons.warning}</span>
      <span>{msg}</span>
    </div>,
    {
      ...base('#FFF8F0', '#E6510040', '#5D2700', '#E65100'),
      ...options,
    }
  );

// ─── Semantic Shortcuts ──────────────────────────────────────────────────────

/** 🛍 Cart added — product name */
export const toastCart = (productName) =>
  toastSuccess(`"${productName}" added to your sacred collection!`, { icon: icons.cart, autoClose: 2500 });

/** 🪔 Order initiated — WhatsApp redirect */
export const toastOrderPlaced = () =>
  toastSuccess('Blessings Initiated! Opening WhatsApp...', { icon: icons.order, autoClose: 3000 });

/** 🗑 Cart cleared */
export const toastCartCleared = () =>
  toastInfo('Your sacred cart has been cleared.', { icon: '🗑', autoClose: 2000 });

/** 🗑 Item removed */
export const toastItemRemoved = (name) =>
  toastInfo(`"${name}" removed from cart.`, { icon: '✦', autoClose: 2000 });

/** ✉ Signup success */
export const toastSignupSuccess = () =>
  toastSuccess('Welcome to M A K & CO! Please sign in.', { icon: '🌺', autoClose: 3500 });

/** 📝 Review submitted */
export const toastReviewSubmitted = () =>
  toastSuccess('Your review has been submitted for sanctity check!', { icon: icons.review, autoClose: 4000 });

/** ❌ Fill all details */
export const toastFillDetails = () =>
  toastError('Please fill in all the sacred details.', { autoClose: 3000 });

/** 📄 PDF coming soon */
export const toastComingSoon = (feature = 'This feature') =>
  toastInfo(`${feature} is coming soon!`, { icon: '✦', autoClose: 3000 });
