import { CheckCircle, Star, Shield, Clock, Package } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function VerifiedBadge() {
  return (
    <span className="verified-badge">
      <CheckCircle size={11} strokeWidth={2.5} />
      Verified
    </span>
  );
}

export function MoqBadge({ moq }: { moq: number | string }) {
  return (
    <span className="moq-badge">
      Min {typeof moq === "number" ? `${moq} pcs` : moq}
    </span>
  );
}

export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star size={13} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-bold text-ink">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-sm text-ink-3">({reviews})</span>
      )}
    </span>
  );
}

export function Badge({ children, variant = "default", className = "" }: { children: ReactNode; variant?: "default" | "success" | "warning" | "info" | "muted" | "brand" | "danger"; className?: string }) {
  const styles = {
    default: "bg-muted text-ink-2",
    success: "bg-success-bg text-success border border-success/30",
    warning: "bg-warning-bg text-warning border border-warning/30",
    danger: "bg-danger-bg text-danger border border-danger/30",
    info: "bg-info-bg text-info border border-info/30",
    muted: "bg-muted text-ink-3 border border-border",
    brand: "bg-brand-50 text-brand-600 border border-brand-200",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "warning" | "info" | "default" | "danger"> = {
    'OPEN': 'info',
    'IN_PROGRESS': 'warning',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
    'PENDING': 'warning',
    'VERIFIED': 'success',
    'REJECTED': 'danger'
  };
  
  return (
    <Badge variant={map[status] || "default"}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none outline-none relative overflow-hidden group";
  const sizes = { sm: "text-xs px-4 py-2 rounded-lg", md: "text-sm px-6 py-2.5 rounded-xl", lg: "text-base px-8 py-3.5 rounded-xl" };
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-brand hover:shadow-brand-hover focus:ring-brand-500 active:scale-[0.98]",
    secondary: "bg-brand-50 text-brand-600 hover:bg-brand-100 focus:ring-brand-500 active:scale-[0.98]",
    outline: "border border-border text-ink bg-white hover:bg-surface hover:border-border-hover focus:ring-ink active:scale-[0.98] hover:shadow-sm",
    ghost: "text-ink hover:bg-surface focus:ring-ink active:scale-[0.98]",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger shadow-sm active:scale-[0.98]",
    glass: "glass text-ink hover:bg-white/90 focus:ring-ink shadow-sm active:scale-[0.98]",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
      )}
    </button>
  );
}

export function Input({ label, placeholder, type = "text", value, onChange, icon, className = "" }: {
  label?: string; placeholder?: string; type?: string; value?: string; onChange?: (v: string) => void; icon?: ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-bold uppercase tracking-wider text-ink-3">{label}</label>}
      <div className="relative group">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-brand-500 transition-colors duration-200">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full border border-border bg-white rounded-xl text-sm font-medium text-ink placeholder:text-ink-3/50 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 shadow-sm ${icon ? "pl-11 pr-4 py-3" : "px-4 py-3"}`}
        />
      </div>
    </div>
  );
}

export function Card({ children, className = "", onClick, hover = false }: { children: ReactNode; className?: string; onClick?: () => void; hover?: boolean }) {
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-xl hover:border-brand-200 cursor-pointer" : "";
  return (
    <div onClick={onClick} className={`bg-white border border-border/80 rounded-2xl shadow-sm transition-all duration-300 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: ReactNode }) {
  return (
    <Card className="p-5" hover>
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center border border-border/50 text-ink-2 shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-display font-bold text-ink">{value}</p>
        {sub && <p className="text-xs font-medium text-ink-3 mt-1">{sub}</p>}
      </div>
    </Card>
  );
}

export function SectionHeader({ title, subtitle, className = "" }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-display font-bold text-ink mb-1.5">{title}</h2>
      {subtitle && <p className="text-sm font-medium text-ink-3">{subtitle}</p>}
    </div>
  );
}
