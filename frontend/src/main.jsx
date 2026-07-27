import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';

import { isAdminRoute } from './admin/routes/adminEntry';

import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';

import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/animations.css';
import './styles/utilities.css';

/**
 * Single React entry point.
 *
 * User App:
 *   - Wrapped with AppProvider and ThemeProvider.
 *
 * Admin Panel (/kanha):
 *   - Runs as an isolated feature module.
 *   - Does not inherit the user application's providers.
 *   - Uses its own admin styling and navigation.
 */
function Root() {
  if (isAdminRoute()) {
    return <AdminApp />;
  }

  return (
    <AppProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);