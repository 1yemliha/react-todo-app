import React from 'react';
import ReactDOM from 'react-dom/client';
// ÖNEMLİ DÜZELTME: Dosya uzantısını (.jsx) belirtiyoruz ve büyük harf uyumunu sağlıyoruz.
import App from './App.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Diğer gereksiz import ve fonksiyon çağrıları kaldırılmıştır.