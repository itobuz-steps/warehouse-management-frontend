import axios from 'axios';
import config from '../config/config';

// Comment out offline check for static build
// if (!navigator.onLine) {
//   window.location.href = './connection-out.html';
// }

const api = axios.create({
  baseURL: `${config.BASE_URL}/user`,
}); // instance create

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
); //before request is sent

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Comment out redirects for static build - let the app handle API failures gracefully
    // if timeout or server don't return anything
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.warn('API call failed:', error.message);
      // For static build, return a rejected promise instead of redirecting
      return Promise.reject(new Error('Server Unreachable'));
    }

    //server crash or any server related issue
    if (error.response && error.response.status >= 500) {
      console.warn('Server error:', error.response.status);
      // For static build, return a rejected promise instead of redirecting
      return Promise.reject(new Error('Server Error'));
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const res = await axios.post(
          `${config.AUTH_BASE_URL}/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const newAccessToken =
          res.data.data.accessToken || res.data.data.access_token;

        if (!newAccessToken) {
          processQueue(new Error('No access token in refresh response'), null);
          console.warn('Authentication failed - no access token');
          // For static build, return rejected promise instead of redirecting
          return Promise.reject(
            new Error('No access token in refresh response')
          );
        }

        localStorage.setItem('access_token', newAccessToken);

        api.defaults.headers.common['Authorization'] =
          'Bearer ' + newAccessToken;
        api.defaults.headers.common['authorization'] =
          'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.warn('Authentication refresh failed:', err.message);
        // For static build, return rejected promise instead of redirecting
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
); //working with response data

export default api;
