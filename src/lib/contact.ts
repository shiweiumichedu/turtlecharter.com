// Single source of truth for our public contact channels, shared by the footer
// and the inquiry form. Email + WeChat only (no WhatsApp, per business preference).
export const CONTACT_EMAIL = 'contact@turtlecharter.com';
export const CONTACT_WECHAT = 'turtlecharter';
// Friend-add QR exported from WeChat (我 → 我的二维码). The contact page only
// renders the QR block when this file exists in public/.
export const WECHAT_QR_PATH = '/images/wechat-qr.png';
