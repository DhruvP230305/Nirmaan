import { CheckCircle, Star, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#059669] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#a7f3d0] shadow-sm">
      <span className="live-bullet" />
      Verified
    </span>
  );
}

export function MoqBadge({ moq }: { moq: number | string }) {
  return (
    <span className="inline-flex items-center bg-[#f4f3ee] text-[#121316] text-[11px] font-mono-tech font-bold tracking-wider px-3 py-1 rounded-full border border-black/5 shadow-sm">
      MOQ {typeof moq === "number" ? `${moq} pcs` : moq}
    </span>
  );
}

export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#ffffff] border border-black/5 px-2.5 py-0.5 rounded-full shadow-sm">
      <Star size={12} className="fill-[#2d62ed] text-[#2d62ed]" />
      <span className="text-xs font-extrabold text-[#121316]">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-[11px] font-medium text-[#6b7280]">({reviews})</span>
      )}
    </span>
  );
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "info" | "muted" | "brand" | "danger" | "lime";
  className?: string;
}) {
  const styles = {
    default: "bg-[#f4f3ee] text-[#121316] border border-black/5",
    success: "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]",
    warning: "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]",
    danger: "bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]",
    info: "bg-[#eff6ff] text-[#2d62ed] border border-[#bfdbfe]",
    muted: "bg-[#f4f3ee] text-[#6b7280] border border-black/5",
    brand: "bg-[#111111] text-[#ffffff] border border-black/10",
    lime: "bg-[#d9ff36] text-[#0d0e11] border border-[#cbff14] shadow-sm",
  };

  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "warning" | "info" | "default" | "danger"> = {
    OPEN: "info",
    IN_PROGRESS: "warning",
    COMPLETED: "success",
    CANCELLED: "danger",
    PENDING: "warning",
    VERIFIED: "success",
    REJECTED: "danger",
  };

  return (
    <Badge variant={map[status] || "default"}>
      {status === "COMPLETED" || status === "VERIFIED" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5 inline-block" />
      ) : status === "IN_PROGRESS" || status === "PENDING" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mr-1.5 inline-block" />
      ) : null}
      {status.replace("_", " ")}
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
  withArrow,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass" | "dark" | "cobalt";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  withArrow?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none rounded-full group";

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };

  const variants = {
    primary:
      "bg-[#d9ff36] text-[#0d0e11] hover:bg-[#cbff14] shadow-[0_8px_25px_rgba(217,255,54,0.45)] hover:shadow-[0_14px_30px_rgba(217,255,54,0.6)] hover:-translate-y-0.5 active:scale-[0.98]",
    dark:
      "bg-[#111111] text-white hover:bg-[#222222] shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:scale-[0.98]",
    cobalt:
      "bg-[#2d62ed] text-white hover:bg-[#2251c9] shadow-[0_8px_20px_rgba(45,98,237,0.35)] hover:-translate-y-0.5 active:scale-[0.98]",
    secondary:
      "bg-[#f4f3ee] text-[#121316] hover:bg-[#ebe9e2] border border-black/5 shadow-sm active:scale-[0.98]",
    outline:
      "border border-black/15 text-[#121316] bg-white/80 hover:bg-white hover:border-black/30 shadow-sm active:scale-[0.98]",
    ghost:
      "text-[#121316] hover:bg-black/5 active:scale-[0.98]",
    danger:
      "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-sm active:scale-[0.98]",
    glass:
      "bg-white/70 backdrop-blur-md border border-white/80 text-[#121316] hover:bg-white shadow-sm active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
      {withArrow && (
        <div className="cta-arrow-circle w-7 h-7 bg-black text-white text-xs -mr-1">
          <ArrowUpRight size={14} />
        </div>
      )}
    </button>
  );
}

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  className = "",
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-[#6b7280] pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#121316] transition-colors">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full border border-black/10 bg-white rounded-full text-sm font-medium text-[#121316] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#121316] focus:ring-4 focus:ring-black/5 transition-all shadow-[var(--shadow-pill)] ${
            icon ? "pl-11 pr-5 py-3" : "px-5 py-3"
          }`}
        />
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}) {
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] cursor-pointer" : "";
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-black/[0.04] rounded-[28px] shadow-[var(--shadow-card)] transition-all duration-300 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-6" hover>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#f9f8f5] flex items-center justify-center border border-black/5 text-[#121316] shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-display font-extrabold text-[#121316] tracking-tight">{value}</p>
        {sub && <p className="text-xs font-medium text-[#9ca3af] mt-1.5">{sub}</p>}
      </div>
    </Card>
  );
}

export function SectionHeader({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#121316] tracking-tight mb-1.5">
        {title}
      </h2>
      {subtitle && <p className="text-sm font-medium text-[#6b7280]">{subtitle}</p>}
    </div>
  );
}

export function Chassis({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="app-viewport">
      <main className={`nitec-chassis ${className}`}>
        {children}
      </main>
    </div>
  );
}
