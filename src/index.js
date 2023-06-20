// Import React components
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from "react-router-dom";
// Import material UI components
// Import redux components
import { Provider } from 'react-redux';
import store from './Store';
// Import custom components
import App from './App';

// Components to render
render(
  <HashRouter>
    {/* Provides redux global state to all components */}
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);
