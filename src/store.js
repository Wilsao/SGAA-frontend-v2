// src/store.js

import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice para gerenciar o estado da interface do usuário (UI)
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload }; // Atualiza o estado de acordo com o payload da ação
    },
  },
});

// Slice para gerenciar o estado de autenticação do usuário (Auth)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: true,
    token: null,
    user: null,
    error: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // Armazena dados adicionais do usuário
      state.error = null; // Limpa erros anteriores
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload; // Armazena mensagem de erro
    },
  },
});

// Exporta as ações geradas automaticamente pelos slices
export const { set } = uiSlice.actions;
export const { loginUser, logoutUser, setAuthError } = authSlice.actions;

// Configura o store usando configureStore do Redux Toolkit
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer, // Registra o slice da interface do usuário
    auth: authSlice.reducer, // Registra o slice de autenticação
  },
});

export default store;
