const config = {
  BASE_URL: 'http://localhost:3000/',
  AUTH_BASE_URL: 'http://localhost:3000/user/auth',
  ADMIN_BASE_URL: 'http://localhost:3000/user/admin',
  PROFILE_BASE_URL: 'http://localhost:3000/profile',
  DASHBOARD_BASE_URL: 'http://localhost:3000/dashboard',
  PRODUCT_BASE_URL: 'http://localhost:3000/product',
  QUANTITY_BASE_URL: 'http://localhost:3000/quantity',
  WAREHOUSE_BASE_URL: 'http://localhost:3000/warehouse',
  NOTIFICATION_BASE_URL: 'http://localhost:3000/notifications',
  TRANSACTION_BASE_URL: 'http://localhost:3000/transaction',
  BROWSER_NOTIFICATION_URL: 'http://localhost:3000/browser-notifications',
  VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: import.meta.env.VITE_VAPID_PRIVATE_KEY,
};

console.log(config.VAPID_PUBLIC_KEY);

export default config;
