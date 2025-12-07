import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Unregister any service workers that might be caching old content
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success && process.env.NODE_ENV === 'development') {
          console.log('Service worker unregistered');
        }
      });
    }
  });
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
