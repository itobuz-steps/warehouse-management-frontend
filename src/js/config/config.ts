const BASE_URL: string =
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

type Config = {
  BASE_URL: string;
  AUTH_BASE_URL: string;
  ADMIN_BASE_URL: string;
  PROFILE_BASE_URL: string;
  DASHBOARD_BASE_URL: string;
  PRODUCT_BASE_URL: string;
  QUANTITY_BASE_URL: string;
  WAREHOUSE_BASE_URL: string;
  TRANSACTION_BASE_URL: string;
  NOTIFICATION_BASE_URL: string;
  PRODUCT_ANALYTICS_URL: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
};

const config: Config = {
  BASE_URL,
  AUTH_BASE_URL: `${BASE_URL}/user/auth`,
  ADMIN_BASE_URL: `${BASE_URL}/user/admin`,
  PROFILE_BASE_URL: `${BASE_URL}/profile`,
  DASHBOARD_BASE_URL: `${BASE_URL}/dashboard`,
  PRODUCT_BASE_URL: `${BASE_URL}/product`,
  QUANTITY_BASE_URL: `${BASE_URL}/quantity`,
  WAREHOUSE_BASE_URL: `${BASE_URL}/warehouse`,
  TRANSACTION_BASE_URL: `${BASE_URL}/transaction`,
  NOTIFICATION_BASE_URL: `${BASE_URL}/notifications`,
  PRODUCT_ANALYTICS_URL: `${BASE_URL}/analytics`,

  VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: import.meta.env.VITE_VAPID_PRIVATE_KEY,
};

export { config };
