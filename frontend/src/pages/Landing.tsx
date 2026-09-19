import { Link } from "react-router-dom";
import {
  CheckCircle, ArrowUpRight, Shield, Package, Zap,
  TrendingDown, Layers, FlaskConical, Play, Sparkles, Factory
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button, Chassis } from "../components/ui";
import { motion } from "framer-motion";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  {
    icon: Shield,
    title: "Verified Manufacturers",
    desc: "Every factory undergoes strict on-site document audits, capability verification, and batch testing before listing.",
    tag: "Audit Score 99.4%"
  },
  {
    icon: TrendingDown,
    title: "Low Minimum Orders",
    desc: "Test new product lines without massive inventory liability. Most partners accept initial runs from just 50 units.",
    tag: "MOQ From 50 pcs"
  },
  {
    icon: FlaskConical,
    title: "Sample Before Bulk",
    desc: "Hold the physical prototype in your hands before committing to bulk capital. Zero risk product validation.",
    tag: "Fast 3-Day Dispatch"
  },
  {
    icon: Layers,
    title: "Full Customization",
    desc: "Custom tooling, Pantone color matching, private label engraving, and specialized surface finishes for your brand.",
    tag: "Bespoke Specs"
  },
  {
    icon: Package,
    title: "Branded Packaging Kits",
    desc: "Source custom rigid boxes, embossed velvet pouches, inserts, and tamper-proof stickers concurrently.",
    tag: "One Consolidated Kit"
  },
  {
    icon: Zap,
    title: "Transparent Milestones",
    desc: "Track raw material sourcing, mold fabrication, assembly, QA, and dispatch right inside your console.",
    tag: "Realtime Escrow"
  },
];

export default function Landing() {
  return (
    <Chassis>
      <Navbar />

      {/* Hero Bento Showcase Grid (2.2fr : 1fr layout per design.md) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Large Main Bento Hero Card (Left ~ 8 cols) */}
        <div className="lg:col-span-8 bento-card p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-white">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="floating-orb w-96 h-96 -top-20 -right-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(45, 98, 237, 0.12) 0%, rgba(217, 255, 54, 0.08) 50%, transparent 70%)"
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#f4f3ee] text-[#121316] text-xs font-mono-tech font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-black/5 shadow-sm">
                <span className="live-bullet" />
                D2C Sourcing Chassis 2026
              </span>
              <span className="inline-flex items-center gap-1 bg-[#d9ff36]/30 text-[#121316] text-xs font-bold px-3 py-1 rounded-full border border-[#cbff14]/60">
                <Sparkles size={12} className="text-[#2d62ed]" /> Direct Factory Rates
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#121316] leading-[1.08] tracking-tight mb-6 max-w-2xl">
              Build Your Brand.<br />
              <span className="text-[#2d62ed]">Source Everything.</span>
            </h1>

            <p className="text-base md:text-lg text-[#6b7280] leading-relaxed max-w-xl font-medium mb-8">
              Connect with vetted high-precision manufacturers, order verified physical samples, bundle custom branded packaging, and scale your brand seamlessly.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/post-requirement" className="cta-lime-btn">
                <span>Start Sourcing Free</span>
                <div className="cta-arrow-circle">↗</div>
              </Link>
              <Link to="/discover">
                <Button variant="outline" size="md" className="font-extrabold text-xs">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>

          {/* Micro Specs Pill Strip */}
          <div className="relative z-10 mt-10 pt-6 border-t border-black/5 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#6b7280]">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#10b981]" />
              <span className="text-[#121316]">Verified Indian MSMEs</span>
            </div>
            <span className="text-black/15">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#10b981]" />
              <span className="text-[#121316]">Zero Commission Markup</span>
            </div>
            <span className="text-black/15">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#10b981]" />
              <span className="text-[#121316]">Escrow Protected Payments</span>
            </div>
          </div>
        </div>

        {/* Right Stack: 2 Bento Tiles (Right ~ 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Tile 1: Dark Tech Visualizer Screen (Section 7F) */}
          <div className="bento-card bg-[#0f172a] text-white p-6 flex flex-col justify-between border-none shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#94a3b8]">
              <span className="tracking-wider">PRODUCTION LINE: LIVE</span>
              <span className="rec-dot" />
            </div>

            <div className="my-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono-tech text-[#94a3b8]">BATCH #NM-9824</span>
                <span className="text-xs font-mono-tech text-[#d9ff36] font-bold">98.4% YIELD</span>
              </div>

              {/* Animated Frequency Bars */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-end justify-between h-20 gap-1.5">
                {[60, 85, 45, 95, 70, 90, 50, 80, 65, 100, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-full"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i % 3 === 0 ? "#d9ff36" : i % 2 === 0 ? "#2d62ed" : "#38bdf8",
                      animation: `eqBounce 1.${(i % 5) + 2}s infinite ease-in-out alternate`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#94a3b8] pt-3 border-t border-slate-800/80">
              <span>LATENCY: 1.2s</span>
              <span className="text-[#38bdf8] font-bold">CALIBRATED</span>
            </div>
          </div>

          {/* Tile 2: Quick Manufacturer Spotlight Bento */}
          <div className="bento-card p-6 flex flex-col justify-between bg-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-[#6b7280]">
                  Factory Spotlight
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#121316] mt-0.5">
                  Artisan Metals Co.
                </h3>
              </div>
              <Link to="/manufacturers" className="cta-arrow-circle w-8 h-8 text-xs">
                ↗
              </Link>
            </div>

            <div className="my-4 p-3.5 bg-[#f9f8f5] rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="text-[#6b7280]">Category</p>
                <p className="font-bold text-[#121316]">Brass & Sterling Jewelry</p>
              </div>
              <div className="text-right">
                <p className="text-[#6b7280]">Capacity</p>
                <p className="font-bold text-[#2d62ed] font-mono-tech">45K units/mo</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#121316]">
                ★ 4.9 <span className="font-normal text-[#6b7280]">(142 orders)</span>
              </span>
              <span className="text-xs font-mono-tech font-bold text-[#10b981] bg-[#ecfdf5] px-2.5 py-1 rounded-full">
                ISO 9001 Certified
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Bento Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Verified Factories", value: 500, suffix: "+", sub: "On-site inspected" },
          { label: "Active D2C Brands", value: 1200, suffix: "+", sub: "Growing with us" },
          { label: "Manufacturing Hubs", value: 50, suffix: "+", sub: "Pan-India presence" },
          { label: "Orders Fulfilled", value: 25000, suffix: "+", sub: "99.8% on-time delivery" },
        ].map((stat, i) => (
          <div key={i} className="bento-card p-5 bg-white text-center sm:text-left">
            <p className="text-[11px] font-mono-tech font-bold text-[#6b7280] uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#121316] tracking-tight">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs font-medium text-[#9ca3af] mt-1">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* The Problem & Solution Split Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: The Old Fragile Way */}
        <div className="lg:col-span-5 bento-card p-8 bg-[#f4f3ee] flex flex-col justify-between border-dashed border-black/15">
          <div>
            <span className="text-[11px] font-mono-tech font-bold text-[#ef4444] uppercase tracking-wider bg-[#fee2e2] px-3 py-1 rounded-full inline-block mb-4">
              Traditional Offline Sourcing
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#121316] mb-4">
              Fragmented. Unpredictable. Opaque.
            </h3>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-6 font-medium">
              Searching directories without verification, chasing calls, traveling to industrial clusters, dealing with arbitrary middlemen markups, and risking capital on untested bulk orders.
            </p>
          </div>

          <div className="space-y-2.5">
            {["High MOQ hurdles (5,000+ units)", "No standardized quality recourse", "Scattered packaging suppliers"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-[#121316] bg-white/70 p-3 rounded-xl border border-black/5">
                <span className="text-[#ef4444]">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: The Nirmaan Chassis Way */}
        <div className="lg:col-span-7 bento-card p-8 md:p-10 bg-[#111111] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div
            className="floating-orb w-80 h-80 -bottom-20 -right-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(217, 255, 54, 0.15) 0%, rgba(45, 98, 237, 0.2) 50%, transparent 70%)"
            }}
          />

          <div className="relative z-10">
            <span className="text-[11px] font-mono-tech font-bold text-[#0d0e11] uppercase tracking-wider bg-[#d9ff36] px-3.5 py-1 rounded-full inline-block mb-4">
              The Nirmaan Operating System
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              One Unified Console.<br />
              Zero Sourcing Friction.
            </h3>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-medium mb-8">
              Every stage digitized into one clean workflow. Direct verified manufacturer quotes, paid sample dispatch within days, and synchronized custom packaging.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Standardized Quotes", desc: "Compare unit economics transparently" },
              { title: "Physical Samples First", desc: "Test real parts before committing capital" },
              { title: "Low Initial Runs", desc: "Batch manufacture from 50 pieces" },
              { title: "Integrated Packaging", desc: "Boxes, pouches, inserts in one PO" },
            ].map((box, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-xs font-bold text-[#d9ff36] font-mono-tech mb-0.5">0{i + 1} · {box.title}</p>
                <p className="text-xs text-slate-400 font-medium">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Feature Bento Grid (6 Tiles) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
              Platform Architecture
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#121316] tracking-tight mt-1">
              Engineered for Modern D2C
            </h2>
          </div>
          <Link to="/how-it-works">
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Explore All Capabilities ↗
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="bento-card p-7 bg-white flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#f9f8f5] group-hover:bg-[#111111] group-hover:text-[#d9ff36] transition-all flex items-center justify-center border border-black/5 text-[#121316] shadow-sm">
                    <f.icon size={22} />
                  </div>
                  <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-[#f4f3ee] text-[#6b7280] px-3 py-1 rounded-full">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#121316] mb-2.5">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[#121316] group-hover:text-[#2d62ed] transition-colors">
                <span>Learn more</span>
                <span className="card-arrow-btn">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Kit Feature Bento */}
      <section className="bento-card p-8 md:p-12 bg-white flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#d9ff36] bg-black px-3.5 py-1 rounded-full inline-block mb-4">
            Exclusive Innovation
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#121316] leading-tight tracking-tight mb-4">
            The Complete<br />
            Business Kit.
          </h2>
          <p className="text-sm md:text-base text-[#6b7280] leading-relaxed font-medium mb-8">
            Don't source scattered pieces. Pair your primary manufactured product with matched custom luxury boxes, embossed pouches, and certificate cards from certified packaging partners in one synchronized bundle.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/business-kit">
              <Button variant="primary" size="md" withArrow className="text-xs font-extrabold">
                Build a Business Kit
              </Button>
            </Link>
            <Link to="/packaging">
              <Button variant="secondary" size="md" className="text-xs font-bold">
                Browse Packaging
              </Button>
            </Link>
          </div>
        </div>

        {/* Tactile Stack Visualizer */}
        <div className="w-full lg:w-auto flex flex-col gap-3">
          {[
            { icon: "💎", title: "Custom Sterling Jewelry", spec: "200 units · ₹45/pc", badge: "Primary Product" },
            { icon: "📦", title: "Magnetic Rigid Box", spec: "200 units · ₹18/pc", badge: "Packaging" },
            { icon: "🛍️", title: "Embossed Microfiber Pouch", spec: "200 units · ₹12/pc", badge: "Insert" },
            { icon: "💌", title: "Thank You & Authenticity Card", spec: "200 units · ₹4/pc", badge: "Print Collateral" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#f9f8f5] hover:bg-white border border-black/5 p-4 rounded-2xl flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all sm:w-[380px]"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-bold text-[#121316]">{item.title}</p>
                  <p className="text-[11px] font-mono-tech text-[#6b7280]">{item.spec}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed] bg-[#eff6ff] px-2.5 py-1 rounded-full">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* High-Voltage Bottom CTA Bento */}
      <section className="bento-card p-10 md:p-14 bg-[#111111] text-white text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div
          className="floating-orb w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(217, 255, 54, 0.2) 0%, rgba(45, 98, 237, 0.15) 60%, transparent 80%)"
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 text-[#d9ff36] text-xs font-mono-tech font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 border border-white/10 backdrop-blur-md">
            Ready to Launch Your Next Line?
          </span>

          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Source with Precision.<br />
            Ship with Confidence.
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-medium mb-8 max-w-lg mx-auto">
            Join 1,200+ brands sourcing with verified factories, upfront sample validation, and escrow protection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="cta-lime-btn text-base px-8 py-3.5">
              <span>Create Free Account</span>
              <div className="cta-arrow-circle w-9 h-9 text-base">↗</div>
            </Link>
            <Link to="/manufacturers">
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white/20 hover:bg-white/10 text-sm font-extrabold">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Inside Chassis */}
      <footer className="pt-8 pb-4 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6b7280]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-display font-black text-xs">
            N
          </div>
          <span className="text-[#121316] font-display font-extrabold tracking-tight">
            Nirmaan Sourcing Chassis
          </span>
          <span className="text-black/20">|</span>
          <span>© 2026 Nirmaan Marketplace</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/how-it-works" className="hover:text-[#121316] transition-colors">How It Works</Link>
          <Link to="/discover" className="hover:text-[#121316] transition-colors">Catalog</Link>
          <Link to="/manufacturers" className="hover:text-[#121316] transition-colors">Factories</Link>
          <Link to="/categories" className="hover:text-[#121316] transition-colors">Categories</Link>
          <Link to="/login" className="hover:text-[#121316] transition-colors">Console Login</Link>
        </div>
      </footer>
    </Chassis>
  );
}
