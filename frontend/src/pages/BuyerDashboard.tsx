import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FileText, MessageSquare, ShoppingBag, TrendingUp, Plus,
  ArrowRight, Search, Factory, Package2, Bell, Clock,
  CheckCircle, AlertCircle, Sparkles, Box
} from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { StatCard, Card, Button, SectionHeader, StatusBadge, Chassis } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";
import { motion } from "framer-motion";

import { getRequirements } from "../data/store";

export default function BuyerDashboard() {
  return (
    <Chassis>
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto pr-2">
          <DashboardHome />
        </main>
      </div>
    </Chassis>
  );
}

function DashboardHome() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rfqs');
        if (res.data.success && res.data.data?.length > 0) {
          setRequirements(res.data.data.slice(0, 5));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("RFQs API offline, loading prototype requirements:", err);
      }
      const local = getRequirements();
      setRequirements(local.slice(0, 5));
      setLoading(false);
    };
    fetchRequirements();
  }, []);

  const getFirstName = (name: string) => name ? name.split(" ")[0] : "Jai";
  const activeReqs = requirements.length > 0 ? requirements.length : 3;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
            Buyer Operating Console · Live Prototype
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#121316] flex items-center gap-2 mt-0.5">
            Good morning, {user ? getFirstName(user.name) : 'Jai'} <span className="animate-bounce-slow">👋</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#6b7280] mt-1 flex items-center gap-2">
            <Sparkles size={14} className="text-[#2d62ed]" /> Direct factory quotes and sample tracking active.
          </p>
        </div>
        <Link to="/post-requirement">
          <Button variant="primary" size="md" withArrow className="font-extrabold text-xs">
            <Plus size={15} /> Post New Requirement
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}><StatCard label="Active Requirements" value={activeReqs} sub="Awaiting quotes" icon={<FileText size={20} className="text-[#121316]" />} /></motion.div>
        <motion.div variants={item}><StatCard label="New Quotes" value={4} sub="Ready to compare" icon={<TrendingUp size={20} className="text-[#2d62ed]" />} /></motion.div>
        <motion.div variants={item}><StatCard label="Pending Samples" value={2} sub="In transit (DTDC)" icon={<Package2 size={20} className="text-[#121316]" />} /></motion.div>
        <motion.div variants={item}><StatCard label="Active Orders" value={3} sub="In batch production" icon={<ShoppingBag size={20} className="text-[#10b981]" />} /></motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        
        <div className="space-y-8">
          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 border-border/80 bg-white shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-5">Quick Actions</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Post Requirement", icon: Plus, to: "/post-requirement", color: "bg-brand-50 text-brand-600", border: "hover:border-brand-300" },
                  { label: "Find Manufacturer", icon: Factory, to: "/manufacturers", color: "bg-success-bg text-success", border: "hover:border-success/30" },
                  { label: "Request Sample", icon: Package2, to: "/samples", color: "bg-warning-bg text-warning", border: "hover:border-warning/30" },
                  { label: "Explore Packaging", icon: Box, to: "/packaging", color: "bg-blue-50 text-blue-600", border: "hover:border-blue-300" },
                ].map((a) => (
                  <Link key={a.label} to={a.to} className={`flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-border ${a.border} transition-colors group`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <a.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-ink-2 text-center group-hover:text-ink">{a.label}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Requirements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SectionHeader title="Recent Requirements" subtitle="Track your active sourcing requests" />
            <Card className="border-border/80 overflow-hidden">
              <div className="divide-y divide-border">
                {loading ? (
                  <div className="p-10 text-center text-sm font-semibold text-ink-3">Loading requirements...</div>
                ) : requirements.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4"><FileText size={24} className="text-ink-3" /></div>
                    <p className="font-bold text-ink mb-1">No requirements yet</p>
                    <p className="text-sm text-ink-3 mb-6">Post your first sourcing requirement to get quotes from verified manufacturers.</p>
                    <Link to="/post-requirement"><Button variant="primary">Post Requirement</Button></Link>
                  </div>
                ) : requirements.map((req) => (
                  <div key={req.id} className="p-5 flex items-center gap-4 hover:bg-surface transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-ink-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <p className="font-bold text-sm text-ink truncate group-hover:text-brand-600 transition-colors">{req.title}</p>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs font-semibold text-ink-3">
                        Qty: {req.quantity} {req.unit} <span className="mx-1.5 opacity-50">|</span> 
                        Target: {req.targetPrice ? `₹${req.targetPrice}` : "Open"} <span className="mx-1.5 opacity-50">|</span> 
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {req.quotes && req.quotes.length > 0 ? (
                        <div className="bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">
                          <p className="font-extrabold text-sm text-brand-700">{req.quotes.length}</p>
                          <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">quotes</p>
                        </div>
                      ) : (
                        <div className="bg-surface px-3 py-1.5 rounded-lg border border-border">
                          <p className="text-xs font-bold text-ink-3 uppercase tracking-widest">Waiting</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {requirements.length > 0 && (
                <div className="p-3 border-t border-border bg-surface/50">
                  <Link to="/requirements">
                    <Button variant="ghost" size="sm" className="w-full font-bold text-ink-2 hover:text-ink">View all requirements <ArrowRight size={14} className="ml-2" /></Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
          
          {/* Sourcing progress */}
          <Card className="p-6 border-border/80 bg-white">
            <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-6">Sourcing Journey</p>
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-4 w-px bg-border" />
              {[
                { step: "Post Requirement", done: requirements.length > 0, desc: requirements.length > 0 ? "Requirement live" : "Start here" },
                { step: "Receive Quotes", done: false, desc: "Waiting for quotes" },
                { step: "Request Sample", done: false, desc: "Next step" },
                { step: "Place Bulk Order", done: false, desc: "" },
                { step: "Source Packaging", done: false, desc: "" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-start gap-4 mb-5 relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${s.done ? "bg-success border-success text-white" : i === 0 && requirements.length === 0 ? "border-brand-500 bg-white text-brand-500" : i === 1 && requirements.length > 0 ? "border-brand-500 bg-white text-brand-500 shadow-[0_0_0_4px_rgba(239,76,35,0.1)]" : "bg-surface border-border text-ink-3"}`}>
                    {s.done ? <CheckCircle size={12} strokeWidth={3} /> : <span className="text-[10px] font-extrabold">{i + 1}</span>}
                  </div>
                  <div className="pb-1 -mt-0.5">
                    <p className={`text-sm font-bold ${s.done ? "text-ink" : (i === 0 && requirements.length === 0) || (i === 1 && requirements.length > 0) ? "text-brand-600" : "text-ink-3"}`}>{s.step}</p>
                    {s.desc && <p className="text-[11px] font-semibold text-ink-3 mt-0.5">{s.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-5 border-border/80">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest">Messages</p>
              <Link to="/messages" className="text-xs text-brand-600 font-bold hover:text-brand-700">View all</Link>
            </div>
            <div className="text-center py-6">
              <MessageSquare size={24} className="text-ink-3 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-ink-3">No active conversations.</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
