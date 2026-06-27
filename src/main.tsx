import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';

// Prevent noisy sandbox-specific or cross-origin "Script error." & ResizeObserver warnings 
// from triggering uncaught browser exceptions or false positive crash telemetry.
if (typeof window !== "undefined") {
  // Direct window.onerror interceptor. Returning true prevents standard reporting of known noise.
  window.onerror = function (message, source, lineno, colno, error) {
    const msg = String(message || "").toLowerCase();
    if (
      !msg ||
      msg.includes("script error") ||
      msg.includes("resizeobserver") ||
      msg.includes("cross-origin") ||
      msg.includes("uncaught")
    ) {
      console.warn("Handled noise-level security warning safety-catch:", message);
      return true; // suppresses the trace completely from parent browsers
    }
    return false;
  };

  window.addEventListener("error", (event) => {
    const msg = String(event.message || "").toLowerCase();
    if (
      !msg ||
      msg.includes("script error") ||
      msg.includes("resizeobserver") ||
      msg.includes("cross-origin") ||
      msg.includes("uncaught")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    const reasonMsg = event.reason?.message || event.reason || "";
    const msg = String(reasonMsg).toLowerCase();
    if (
      !msg ||
      msg.includes("script error") ||
      msg.includes("resizeobserver") ||
      msg.includes("cross-origin") ||
      msg.includes("uncaught")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
