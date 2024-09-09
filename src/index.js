// src/index.js

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // Fornece o estado global para a aplicação
import 'core-js'

import App from './App'
import store from './store' // Importa o store configurado com Redux Toolkit

// Renderiza a aplicação React com o Redux Provider
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
