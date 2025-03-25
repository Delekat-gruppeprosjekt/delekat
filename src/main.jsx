import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/authContext/auth";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing Clerk publishable key. Please add it to your .env file."
  );
} 

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </ClerkProvider>
);