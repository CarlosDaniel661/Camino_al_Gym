import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";

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
    // Apply dark class to html element for Tailwind dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
              className="flex-grow p-4 md:p-8 pt-20 md:pt-24 pb-20 md:pb-8"
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
          <MobileNav />
        </div>
      </Router>
    </HelmetProvider>
  );
}
