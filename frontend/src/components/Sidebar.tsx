import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Search, Factory, FileText, MessageSquare,
  ShoppingBag, Package2, Star, Bell, Settings, ChevronRight,
  BarChart3, Shield, Users, ClipboardList, CreditCard,
  Layers, Box, PackageCheck, FlaskConical,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const buyerNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Discover Products", icon: Search, to: "/discover" },
  { label: "Manufacturers", icon: Factory, to: "/manufacturers" },
  { label: "My Requirements", icon: FileText, to: "/requirements" },
  { label: "Quotes", icon: ClipboardList, to: "/quotes" },
  { label: "Samples", icon: FlaskConical, to: "/samples" },
  { label: "Orders", icon: ShoppingBag, to: "/orders" },
  { label: "Packaging", icon: Package2, to: "/packaging" },
  { label: "Business Kit", icon: Layers, to: "/business-kit" },
  { label: "Messages", icon: MessageSquare, to: "/messages" },
  { label: "Reviews", icon: Star, to: "/reviews" },
  { label: "Notifications", icon: Bell, to: "/notifications" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

const manufacturerNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/mfr/dashboard" },
  { label: "My Products", icon: Box, to: "/mfr/products" },
  { label: "Requirements", icon: FileText, to: "/mfr/requirements" },
  { label: "Quotes", icon: ClipboardList, to: "/mfr/quotes" },
  { label: "Samples", icon: FlaskConical, to: "/mfr/samples" },
  { label: "Orders", icon: PackageCheck, to: "/mfr/orders" },
  { label: "Messages", icon: MessageSquare, to: "/mfr/messages" },
  { label: "Reviews", icon: Star, to: "/mfr/reviews" },
  { label: "Analytics", icon: BarChart3, to: "/mfr/analytics" },
  { label: "Verification", icon: Shield, to: "/mfr/verification" },
  { label: "Settings", icon: Settings, to: "/mfr/settings" },
];

const adminNav = [
  { label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Manufacturers", icon: Factory, to: "/admin/manufacturers" },
  { label: "Verification", icon: Shield, to: "/admin/verification" },
  { label: "Products", icon: Box, to: "/admin/products" },
  { label: "Requirements", icon: FileText, to: "/admin/requirements" },
  { label: "Quotes", icon: ClipboardList, to: "/admin/quotes" },
  { label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
  { label: "Payments", icon: CreditCard, to: "/admin/payments" },
  { label: "Reviews", icon: Star, to: "/admin/reviews" },
  { label: "Packaging", icon: Package2, to: "/admin/packaging" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

export default function Sidebar({ type = "buyer" }: { type?: "buyer" | "manufacturer" | "admin" }) {
  const loc = useLocation();
  const { user } = useAuth();
  const nav = type === "buyer" ? buyerNav : type === "manufacturer" ? manufacturerNav : adminNav;
  const label = type === "buyer" ? "Buyer Portal" : type === "manufacturer" ? "Manufacturer Portal" : "Admin Panel";

  const displayName = user?.companyName || user?.name || (type === "buyer" ? "My Account" : type === "manufacturer" ? "Manufacturer" : "Admin");
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col h-full overflow-y-auto hidden md:flex">
      <div className="px-5 py-4 border-b border-border bg-surface/30">
        <span className="text-[11px] font-bold text-ink-3 uppercase tracking-widest">{label}</span>
      </div>
      
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors group"
            >
              <span className="relative z-10 flex items-center gap-3 w-full">
                <item.icon size={18} className={active ? "text-brand-600" : "text-ink-3 group-hover:text-ink-2"} />
                <span className={active ? "text-brand-700" : "text-ink-2 group-hover:text-ink"}>{item.label}</span>
              </span>
              
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-brand-50 rounded-xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {!active && (
                <div className="absolute inset-0 bg-surface opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200 z-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-border bg-surface/30">
        <Link to={type === "buyer" ? "/settings" : type === "manufacturer" ? "/mfr/settings" : "/admin/settings"} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white border border-transparent hover:border-border transition-all group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 border border-brand-300 flex items-center justify-center text-brand-700 text-xs font-bold shadow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate group-hover:text-brand-600 transition-colors">
              {displayName}
            </p>
            <p className="text-[11px] font-semibold text-ink-3 capitalize tracking-wide">{type}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
