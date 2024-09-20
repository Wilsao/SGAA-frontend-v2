// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// (temporário)Ver o que está no localStorage na hora que recarrega a página
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('user'))
console.log(localStorage.getItem('role'))

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Slice para gerenciar o estado de autenticação do usuário (Auth)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || 'guest',
    error: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.error = null;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', action.payload.user.id);
      localStorage.setItem('role', action.payload.role);

    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.role = 'guest';
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { set } = uiSlice.actions;
export const { loginUser, logoutUser, setAuthError } = authSlice.actions;

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
