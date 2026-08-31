import { Link, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Find Manufacturers", to: "/manufacturers" },
    { label: "Browse Products", to: "/discover" },
    { label: "Categories", to: "/categories" },
    { label: "How it Works", to: "/how-it-works" },
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass shadow-sm py-2" 
          : "bg-white border-b border-border py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-all duration-300">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-display font-extrabold text-ink text-xl tracking-tight">
            Nirmaan<span className="text-brand-500">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const isActive = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors group"
              >
                <span className={`relative z-10 ${isActive ? "text-brand-600" : "text-ink-2 group-hover:text-ink"}`}>
                  {l.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-brand-50 rounded-lg z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 z-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="font-bold">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="shadow-brand">Get Started</Button>
          </Link>
          <button 
            className="lg:hidden p-2 text-ink-2 hover:bg-muted rounded-lg transition-colors" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    loc.pathname === l.to ? "bg-brand-50 text-brand-600" : "text-ink-2 hover:bg-muted"
                  }`}>
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2"></div>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-ink-2 hover:bg-muted">
                Log in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function DashboardNavbar({ userType = "buyer" }: { userType?: "buyer" | "manufacturer" | "admin" }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-all duration-300">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <span className="font-display font-bold text-ink text-lg hidden sm:block tracking-tight">
          Nirmaan<span className="text-brand-500">.</span>
        </span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center text-ink-3 relative transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-500 border-2 border-white rounded-full" />
        </button>
        <Link 
          to={userType === "buyer" ? "/settings" : userType === "manufacturer" ? "/mfr/settings" : "/admin/settings"} 
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface border border-transparent hover:border-border transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 border border-brand-300 flex items-center justify-center text-brand-700 text-xs font-bold shadow-sm">
            {userType === "buyer" ? "JD" : userType === "manufacturer" ? "AM" : "AD"}
          </div>
          <span className="text-sm font-bold text-ink hidden sm:block">
            {userType === "buyer" ? "Jai Duggal" : userType === "manufacturer" ? "Artisan Metals" : "Admin"}
          </span>
          <ChevronDown size={14} className="text-ink-3" />
        </Link>
      </div>
    </header>
  );
}
