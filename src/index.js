// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App'; // Import AppWrapper, not App directly

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper /> {/* Render AppWrapper here */}
  </React.StrictMode>
);