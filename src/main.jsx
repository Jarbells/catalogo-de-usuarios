import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // ESTILOS GLOBAIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BROWSER ROUTER */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);