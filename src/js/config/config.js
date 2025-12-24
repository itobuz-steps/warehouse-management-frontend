const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const config = {
  BASE_URL,
  AUTH_BASE_URL: `${BASE_URL}/user/auth`,
  ADMIN_BASE_URL: `${BASE_URL}/user/admin`,
  PROFILE_BASE_URL: `${BASE_URL}/profile`,
  DASHBOARD_BASE_URL: `${BASE_URL}/dashboard`,
  PRODUCT_BASE_URL: `${BASE_URL}/product`,
  QUANTITY_BASE_URL: `${BASE_URL}/quantity`,
  WAREHOUSE_BASE_URL: `${BASE_URL}/warehouse`,
  // NOTIFICATION_BASE_URL: `${BASE_URL}/notifications`,
  TRANSACTION_BASE_URL: `${BASE_URL}/transaction`,
  NOTIFICATION_BASE_URL: `${BASE_URL}/notifications`,
  NOTIFICATION_URL: `${BASE_URL}/notifications`,
  PRODUCT_ANALYTICS_URL: `${BASE_URL}/analytics`,

  VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: import.meta.env.VITE_VAPID_PRIVATE_KEY,
};

export default config;
