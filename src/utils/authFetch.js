// src/utils/authFetch.js
// import { store } from './../store';
const authFetch = async (url, options = {}) => {
  // const token = store.getState().auth.token;
  const token = localStorage.getItem('token');

  const headers = options.headers ? options.headers : {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const newOptions = {
    ...options,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, newOptions);
};

export default authFetch;
