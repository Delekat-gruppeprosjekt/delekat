import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import { AuthProvider } from "./contexts/authContext/auth";
import { ToastProvider } from "./contexts/toastContext/toast";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </React.StrictMode>
);