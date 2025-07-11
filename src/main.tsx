import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EimSearch from "./components/EimSearch";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EimSearch />} />
        <Route path="/dashboard/:eimName" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
