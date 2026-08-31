import { Link } from "react-router-dom";
import {
  CheckCircle, ArrowRight, Shield, Package, Zap,
  TrendingDown, Layers, FlaskConical, Play
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui";
import { motion, useAnimation, useInView } from "framer-motion";

// Helper component for count up
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
  { icon: Shield, title: "Verified Manufacturers", desc: "Every manufacturer goes through document verification, capability checks, and quality review before listing." },
  { icon: TrendingDown, title: "Low Minimum Orders", desc: "Start small. Most suppliers on our platform accept orders from just 50 pieces — perfect for new brands." },
  { icon: FlaskConical, title: "Sample Before Bulk", desc: "Request a physical product sample before committing to a bulk order. Zero risk product validation." },
  { icon: Layers, title: "Custom Manufacturing", desc: "Logo, colour, material, packaging — customise every aspect of your product for your brand." },
  { icon: Package, title: "Packaging & Branding", desc: "Source boxes, pouches, stickers, and thank-you cards from the same platform. One complete kit." },
  { icon: Zap, title: "One Complete Journey", desc: "From product idea to ready-to-sell inventory — manage everything in one single dashboard." },
];

export default function Landing() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Premium Hero */}
      <section className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32 border-b border-border">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-[0.15] pointer-events-none" 
             style={{ background: "radial-gradient(ellipse at top, var(--color-brand-500), transparent 70%)" }} />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(228,228,231,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(228,228,231,0.3)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-brand-50/80 backdrop-blur-md text-brand-700 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-8 border border-brand-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
              The Sourcing Platform for D2C Brands
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-ink leading-[1.1] tracking-tight mb-8 max-w-4xl mx-auto">
              Build Your Business.<br />
              <span className="text-gradient">Source Everything.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-ink-3 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
              Find verified manufacturers, source at low MOQ, request samples, customize products, and build your brand — all in one place.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <Link to="/post-requirement" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4 text-base group">
                  Start Sourcing Free 
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/manufacturers" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-base shadow-sm">
                  <Play size={18} className="mr-2 text-ink-3" fill="currentColor" /> Watch Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Sourcing Network Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, type: "spring" }}
            className="mt-20 max-w-5xl mx-auto relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 z-10 top-1/2 pointer-events-none"></div>
            <div className="relative bg-surface/50 backdrop-blur-xl rounded-3xl p-8 border border-border/80 shadow-2xl flex items-center justify-between overflow-hidden">
              
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 -translate-y-1/2 z-0 opacity-50">
                <motion.div 
                  className="absolute inset-0 bg-brand-500 blur-sm"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
              </div>

              {/* Nodes */}
              {[
                { icon: "💡", label: "Idea", delay: 0 },
                { icon: "🏭", label: "Factory", delay: 0.2 },
                { icon: "🧪", label: "Sample", delay: 0.4 },
                { icon: "📦", label: "Production", delay: 0.6 },
                { icon: "🎁", label: "Packaging", delay: 0.8 },
                { icon: "🚀", label: "Launch", delay: 1.0 },
              ].map((step, idx) => (
                <motion.div 
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + step.delay, type: "spring", stiffness: 200 }}
                  className="relative z-10 flex flex-col items-center gap-4 group cursor-default"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-border/80 shadow-lg flex items-center justify-center text-3xl group-hover:-translate-y-2 group-hover:shadow-brand transition-all duration-300">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-ink-2 uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full shadow-sm">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-border relative z-20 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl shadow-ink/5">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <div className="text-center px-4 py-2">
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-brand-600 mb-1"><Counter value={500} suffix="+" /></h3>
            <p className="text-xs md:text-sm font-bold text-ink-3 uppercase tracking-wider">Verified Factories</p>
          </div>
          <div className="text-center px-4 py-2">
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-brand-600 mb-1"><Counter value={1200} suffix="+" /></h3>
            <p className="text-xs md:text-sm font-bold text-ink-3 uppercase tracking-wider">Active Brands</p>
          </div>
          <div className="text-center px-4 py-2">
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-brand-600 mb-1"><Counter value={50} suffix="+" /></h3>
            <p className="text-xs md:text-sm font-bold text-ink-3 uppercase tracking-wider">Categories</p>
          </div>
          <div className="text-center px-4 py-2">
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-brand-600 mb-1">₹<Counter value={50} suffix="M+" /></h3>
            <p className="text-xs md:text-sm font-bold text-ink-3 uppercase tracking-wider">Sourced Volume</p>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeUp} className="text-brand-500 font-bold tracking-widest uppercase text-xs mb-4">The Old Way</motion.p>
              <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold mb-8 text-white">Fragmented. Slow. Unreliable.</motion.h2>
              <motion.div variants={fadeUp} className="flex items-center gap-4 text-ink-3 font-semibold text-lg md:text-xl mb-8 flex-wrap">
                <span className="line-through decoration-danger decoration-2 opacity-60">Search</span> <ArrowRight size={18} className="opacity-40" />
                <span className="line-through decoration-danger decoration-2 opacity-60">Call</span> <ArrowRight size={18} className="opacity-40" />
                <span className="line-through decoration-danger decoration-2 opacity-60">Travel</span> <ArrowRight size={18} className="opacity-40" />
                <span className="line-through decoration-danger decoration-2 opacity-60">Negotiate</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-ink-2 rounded-3xl p-10 md:p-12 border border-ink-3/20 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500 blur-[120px] opacity-20 rounded-full pointer-events-none" />
              <p className="text-brand-500 font-bold tracking-widest uppercase text-xs mb-4">The Nirmaan Way</p>
              <h2 className="font-display text-4xl font-extrabold mb-6 text-white tracking-tight">One Platform.<br/>One Workflow.</h2>
              <p className="text-ink-3 text-lg leading-relaxed font-medium">
                We've digitized the entire procurement lifecycle. Find the best supplier, compare standard quotes, approve physical samples, and attach your custom branding without ever leaving the dashboard.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Nirmaan */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-6 tracking-tight">Built for Modern Brands</h2>
            <p className="text-ink-3 text-lg md:text-xl max-w-2xl mx-auto font-medium">Everything you need to source reliably, quickly, and at premium quality without the traditional complexity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-3xl border border-border hover:border-brand-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-brand-100">
                  <f.icon size={26} className="text-brand-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-3 group-hover:text-brand-600 transition-colors">{f.title}</h3>
                <p className="text-ink-3 leading-relaxed font-medium text-sm md:text-base">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Kit Feature */}
      <section className="py-24 md:py-32 bg-white border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="order-2 lg:order-1 relative"
            >
              <div className="absolute inset-0 bg-brand-500 blur-[100px] opacity-[0.08] rounded-full pointer-events-none" />
              
              {/* Stacked Cards Animation */}
              <div className="relative h-[450px] w-full flex items-center justify-center">
                {[
                  { icon: "💎", name: "200 Custom Earrings", price: "₹45/pc", rotate: -6, z: 10 },
                  { icon: "📦", name: "200 Jewellery Boxes", price: "₹15/pc", rotate: -2, z: 20 },
                  { icon: "🛍️", name: "200 Velvet Pouches", price: "₹12/pc", rotate: 2, z: 30 },
                  { icon: "💌", name: "200 Thank You Cards", price: "₹4/pc", rotate: 6, z: 40 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 100, rotate: 0 }}
                    whileInView={{ opacity: 1, y: i * 15 - 30, rotate: item.rotate }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 100, damping: 15 }}
                    className="absolute bg-white rounded-2xl border border-border/80 shadow-2xl p-6 w-[320px] glass"
                    style={{ zIndex: item.z }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-2xl shadow-inner border border-border/50">
                          {item.icon}
                        </div>
                        <span className="font-bold text-ink">{item.name}</span>
                      </div>
                      <span className="font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg text-sm">{item.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="order-1 lg:order-2"
            >
              <motion.p variants={fadeUp} className="text-brand-500 font-bold tracking-widest uppercase text-xs mb-4">The Differentiator</motion.p>
              <motion.h2 variants={fadeUp} className="font-display text-4xl lg:text-5xl font-extrabold text-ink mb-6 tracking-tight">The Complete<br/>Business Kit</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-ink-3 leading-relaxed mb-8 font-medium">
                Don't just source a product. Source a brand. Nirmaan allows you to bundle your core product with custom packaging, boxes, inserts, and stickers from specialized suppliers into one cohesive order.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-4 mb-10">
                {[
                  "Match product quantities with packaging",
                  "Synchronized production timelines",
                  "Consolidated shipping options",
                  "Zero scattered communication"
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-4 text-ink font-semibold">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                      <CheckCircle size={14} strokeWidth={3} />
                    </div>
                    {point}
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-brand">Explore Packaging <ArrowRight size={16} className="ml-2" /></Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-full bg-gradient-to-l from-brand-600/20 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Ready to launch your brand?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-ink-3 mb-10 max-w-2xl mx-auto font-medium"
          >
            Join the new generation of D2C founders building better businesses with Nirmaan.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 py-4 shadow-xl shadow-brand-500/30 text-base">
                Start Sourcing Free
              </Button>
            </Link>
            <Link to="/manufacturers">
              <Button size="lg" className="w-full sm:w-auto px-10 py-4 bg-white/5 text-white hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-base">
                Browse Directory
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-16 border-t border-ink-2/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-display font-extrabold text-white text-xl leading-none">N</span>
              </div>
              <span className="font-display font-bold text-white text-2xl tracking-tight">Nirmaan.</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-semibold text-ink-3">
              <Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
              <Link to="/manufacturers" className="hover:text-white transition-colors">Manufacturers</Link>
              <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-ink-2/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-ink-3">
            <p>© 2026 Nirmaan Marketplace. All rights reserved.</p>
            <p className="tracking-widest uppercase">Source. Create. Launch.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
