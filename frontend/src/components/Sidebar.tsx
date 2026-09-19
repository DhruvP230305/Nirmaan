import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Search, Factory, FileText, MessageSquare,
  ShoppingBag, Package2, Star, Bell, Settings,
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

export default function Sidebar({
  type = "buyer",
}: {
  type?: "buyer" | "manufacturer" | "admin";
}) {
  const loc = useLocation();
  const { user } = useAuth();
  const nav = type === "buyer" ? buyerNav : type === "manufacturer" ? manufacturerNav : adminNav;
  const label =
    type === "buyer"
      ? "Buyer Console"
      : type === "manufacturer"
      ? "Mfr Console"
      : "Admin Console";

  const displayName =
    user?.companyName ||
    user?.name ||
    (type === "buyer" ? "Jai Duggal" : type === "manufacturer" ? "Artisan Metals" : "Admin");
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 shrink-0 bg-white/90 backdrop-blur-md border border-white/80 rounded-[28px] shadow-[var(--shadow-card)] flex flex-col h-[calc(100vh-140px)] sticky top-6 overflow-hidden hidden md:flex mr-6">
      <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
        <span className="text-[11px] font-mono-tech font-extrabold text-[#6b7280] uppercase tracking-widest">
          {label}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
      </div>

      <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all group ${
                active
                  ? "bg-[#111111] text-white shadow-sm"
                  : "text-[#6b7280] hover:text-[#121316] hover:bg-[#f4f3ee]"
              }`}
            >
              <item.icon
                size={16}
                className={
                  active ? "text-[#d9ff36]" : "text-[#6b7280] group-hover:text-[#121316]"
                }
              />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d9ff36]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-3 border-t border-black/5 bg-[#f9f8f5]/60">
        <Link
          to={
            type === "buyer"
              ? "/settings"
              : type === "manufacturer"
              ? "/mfr/settings"
              : "/admin/settings"
          }
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-[#d9ff36] group-hover:text-black transition-colors">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-[#121316] truncate group-hover:text-[#2d62ed] transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] font-mono-tech font-semibold text-[#6b7280] capitalize">
              {type} · Active
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
