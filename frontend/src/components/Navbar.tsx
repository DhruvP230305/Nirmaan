import { Link, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  const navLinks = [
    { label: "Find Manufacturers", to: "/manufacturers" },
    { label: "Browse Products", to: "/discover" },
    { label: "Categories", to: "/categories" },
    { label: "How it Works", to: "/how-it-works" },
  ];

  return (
    <header className="w-full flex flex-col gap-2.5 mb-6">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#6b7280] px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="live-bullet" />
          <span className="text-[#121316]">500+ Verified Factories Live</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Low MOQs from 50 pcs</span>
          <span className="text-black/20">•</span>
          <span>Zero Commission Guarantee</span>
          <span className="text-black/20">•</span>
          <div className="bg-white/80 border border-black/5 text-[#121316] font-mono-tech px-2.5 py-0.5 rounded-full shadow-sm text-[11px] font-bold">
            INR (₹)
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Pill Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border border-white/80 rounded-full px-4 py-2.5 shadow-[var(--shadow-pill)] flex items-center justify-between gap-3 relative z-30">
        <Link to="/" className="flex items-center gap-2.5 pl-2 shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center text-white font-display font-extrabold text-base shadow-sm group-hover:bg-[#d9ff36] group-hover:text-black transition-all">
            N
          </div>
          <span className="font-display font-extrabold text-[#121316] text-xl tracking-tight">
            Nirmaan<span className="text-[#2d62ed]">.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#f4f3ee]/80 p-1 rounded-full border border-black/5">
          {navLinks.map((l) => {
            const isActive = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-[#6b7280] hover:text-[#121316] hover:bg-black/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/discover"
            className="hidden md:flex items-center gap-2 bg-[#f4f3ee] text-[#6b7280] hover:text-[#121316] hover:bg-[#ebe9e2] px-3.5 py-1.5 rounded-full text-xs font-medium border border-black/5 transition-colors"
          >
            <Search size={13} />
            <span>Search catalogue...</span>
          </Link>

          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="font-bold text-xs">
              Log in
            </Button>
          </Link>

          <Link to="/post-requirement">
            <Button variant="primary" size="sm" withArrow className="text-xs font-extrabold">
              Post RFQ
            </Button>
          </Link>

          <Link
            to="/orders"
            className="w-9 h-9 rounded-full bg-[#111111] hover:bg-black text-white flex items-center justify-center relative shadow-sm transition-transform active:scale-95"
            title="Orders"
          >
            <ShoppingBag size={15} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d9ff36] text-[#0d0e11] text-[10px] font-black flex items-center justify-center border-2 border-white">
              2
            </span>
          </Link>

          <button
            className="lg:hidden p-2 text-[#121316] hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white rounded-3xl p-4 border border-black/10 shadow-xl flex flex-col gap-2"
          >
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
                  loc.pathname === l.to
                    ? "bg-[#111111] text-white"
                    : "text-[#121316] hover:bg-[#f4f3ee]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-black/5 my-1" />
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-full text-sm font-bold text-[#121316] hover:bg-[#f4f3ee]"
            >
              Log in
            </Link>
            <Link
              to="/post-requirement"
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="primary" size="md" className="w-full text-center">
                Start Sourcing Free
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function DashboardNavbar({
  userType = "buyer",
}: {
  userType?: "buyer" | "manufacturer" | "admin";
}) {
  return (
    <header className="bg-white/90 backdrop-blur-md border border-white/80 rounded-full px-5 py-3 shadow-[var(--shadow-pill)] flex items-center justify-between gap-4 mb-6 sticky top-4 z-40">
      <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-display font-extrabold text-sm shadow-sm group-hover:bg-[#d9ff36] group-hover:text-black transition-all">
          N
        </div>
        <span className="font-display font-extrabold text-[#121316] text-lg hidden sm:block tracking-tight">
          Nirmaan<span className="text-[#2d62ed]">.</span>
        </span>
      </Link>

      <div className="flex-1 max-w-md hidden md:block">
        <div className="flex items-center gap-2 bg-[#f4f3ee] rounded-full px-4 py-2 border border-black/5">
          <Search size={14} className="text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search orders, suppliers, RFQs..."
            className="bg-transparent text-xs font-medium text-[#121316] focus:outline-none w-full placeholder:text-[#9ca3af]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="w-9 h-9 rounded-full bg-[#f4f3ee] hover:bg-[#ebe9e2] flex items-center justify-center text-[#121316] relative transition-colors"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#d9ff36] rounded-full border border-black" />
        </Link>

        <Link
          to={
            userType === "buyer"
              ? "/settings"
              : userType === "manufacturer"
              ? "/mfr/settings"
              : "/admin/settings"
          }
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-[#f4f3ee] hover:bg-[#ebe9e2] border border-black/5 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
            {userType === "buyer" ? "JD" : userType === "manufacturer" ? "AM" : "AD"}
          </div>
          <span className="text-xs font-bold text-[#121316] hidden sm:block">
            {userType === "buyer"
              ? "Jai Duggal"
              : userType === "manufacturer"
              ? "Artisan Metals"
              : "Admin"}
          </span>
          <ChevronDown size={13} className="text-[#6b7280]" />
        </Link>
      </div>
    </header>
  );
}
