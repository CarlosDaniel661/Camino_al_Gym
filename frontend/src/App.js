import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Reserve from "./components/Reserve";
import PostDetail from "./components/PostDetail";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Services from "./components/Services";

import "./index.css";

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    // Use data-theme attribute so your CSS rules that target [data-theme="dark"] work
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar theme={theme} setTheme={setTheme} />

          <div className="flex flex-grow">
            <Sidebar />

            {/* Main content: add generous top padding to prevent header from overlapping any content, including images */}
            <main 
              className="flex-grow p-4 md:p-8 pt-20 md:pt-24" 
              aria-live="polite"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>

          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
