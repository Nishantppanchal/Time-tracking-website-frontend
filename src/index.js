// Import React components
import React, { lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// Import material UI components
// Import redux components
import { Provider } from 'react-redux';
import store from './Store';
// Import custom components
import App from './App';

// Components to render
render(
  <BrowserRouter>
    {/* Provides redux global state to all components */}
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
