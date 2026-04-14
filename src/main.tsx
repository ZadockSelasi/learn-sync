import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

window.onerror = function(msg, url, line, col, error) {
  document.body.innerHTML = '<div style="color:red;padding:20px;z-index:9999;position:fixed;background:white"><h1>Global Error</h1><pre>' + msg + '</pre></div>';
};
window.addEventListener("unhandledrejection", function(promiseRejectionEvent) {
  document.body.innerHTML = '<div style="color:red;padding:20px;z-index:9999;position:fixed;background:white"><h1>Unhandled Rejection</h1><pre>' + promiseRejectionEvent.reason + '</pre></div>';
});

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
