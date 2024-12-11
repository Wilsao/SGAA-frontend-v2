import { configureStore, createSlice } from '@reduxjs/toolkit';

// (temporário) Ver o que está no localStorage na hora que recarrega a página
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('userId'));
console.log(localStorage.getItem('pessoaId'));
console.log(localStorage.getItem('userEmail'));
console.log(localStorage.getItem('userNome'));
console.log(localStorage.getItem('userRole'));
console.log(localStorage.getItem('userRoleName'));

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
    userId: localStorage.getItem('userId') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    userNome: localStorage.getItem('userNome') || null,
    userRole: localStorage.getItem('userRole') || '3',
    userRoleName: localStorage.getItem('userRoleName'),
    hasSecurityQuestion: JSON.parse(localStorage.getItem('hasSecurityQuestion')) || false,
    error: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.pessoaId = action.payload.pessoaId;
      state.userEmail = action.payload.userEmail;
      state.userNome = action.payload.userNome;
      state.userRole = action.payload.userRole;
      state.userRoleName = action.payload.userRoleName;
      state.hasSecurityQuestion = action.payload.hasSecurityQuestion;
      state.error = null;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('pessoaId', action.payload.pessoaId);
      localStorage.setItem('userEmail', action.payload.userEmail);
      localStorage.setItem('userNome', action.payload.userNome);
      localStorage.setItem('userRole', action.payload.userRole);
      localStorage.setItem('userRoleName', action.payload.userRoleName);
      localStorage.setItem(
        'hasSecurityQuestion',
        JSON.stringify(action.payload.hasSecurityQuestion)
      );
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.userEmail = null;
      state.userNome = null;
      state.userRole = '3';
      state.userRoleName = null;
      state.hasSecurityQuestion = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('pessoaId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userNome');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userRoleName');
      localStorage.removeItem('hasSecurityQuestion');
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    // Nova ação para atualizar hasSecurityQuestion
    updateHasSecurityQuestion: (state, action) => {
      state.hasSecurityQuestion = action.payload;
      localStorage.setItem('hasSecurityQuestion', JSON.stringify(action.payload));
    },
  },
});

export const { set } = uiSlice.actions;
export const { loginUser, logoutUser, setAuthError, updateHasSecurityQuestion } = authSlice.actions;

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
