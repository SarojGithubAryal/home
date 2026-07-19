import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/animations.css';
import './styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
);