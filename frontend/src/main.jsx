import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import AuthProvider from "./context/AuthContext";
import { PerformanceProvider } from "./context/PerformanceContext";
import { AvatarProvider } from "./context/AvatarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PerformanceProvider>
          <AvatarProvider>
            <App />
          </AvatarProvider>
        </PerformanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);