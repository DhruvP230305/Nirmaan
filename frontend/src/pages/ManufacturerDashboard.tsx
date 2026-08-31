import { useState, useEffect } from "react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { StatCard, Card, Button, Badge, SectionHeader } from "../components/ui";
import { FileText, Users, TrendingUp, DollarSign, X, CheckCircle2, ChevronRight, Briefcase, PackageSearch, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";

interface RFQ {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  targetPrice: number | null;
  status: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    companyName: string;
  };
}

const analyticsData = [
  { name: 'Jan', quotes: 4, accepted: 1 },
  { name: 'Feb', quotes: 7, accepted: 2 },
  { name: 'Mar', quotes: 5, accepted: 1 },
  { name: 'Apr', quotes: 9, accepted: 3 },
  { name: 'May', quotes: 12, accepted: 4 },
  { name: 'Jun', quotes: 8, accepted: 3 },
];

export default function ManufacturerDashboard() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);

  const [unitPrice, setUnitPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState("");

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      const res = await api.get("/rfqs");
      if (res.data.success) {
        setRfqs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch RFQs", err);
    } finally {
      setLoading(false);
    }
  };

  const openQuoteModal = (rfq: RFQ) => {
    setSelectedRfq(rfq);
    setUnitPrice(rfq.targetPrice ? rfq.targetPrice.toString() : "");
    setDeliveryTime("");
    setNotes("");
    setQuoteError("");
    setQuoteSuccess("");
    setQuoteModalOpen(true);
  };

  const submitQuote = async () => {
    if (!selectedRfq) return;
    if (!unitPrice || !deliveryTime) {
      setQuoteError("Unit price and delivery time are required.");
      return;
    }

    try {
      setSubmittingQuote(true);
      setQuoteError("");
      const price = parseFloat(unitPrice);
      const days = parseInt(deliveryTime);

      const res = await api.post(`/rfqs/${selectedRfq.id}/quotes`, {
        unitPrice: price,
        totalPrice: price * selectedRfq.quantity,
        deliveryTimeDays: days,
        notes: notes || undefined
      });

      if (res.data.success) {
        setQuoteSuccess("Quote submitted successfully!");
        setTimeout(() => {
          setQuoteModalOpen(false);
          fetchRfqs();
        }, 1500);
      }
    } catch (err: any) {
      setQuoteError(err.response?.data?.message || "Failed to submit quote.");
    } finally {
      setSubmittingQuote(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="manufacturer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="manufacturer" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FDFCFB]">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Area */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">Manufacturer Portal</h1>
                <p className="text-ink-3 mt-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Factory operations online and receiving leads.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="shadow-sm">Update Profile</Button>
                <Button variant="primary" className="shadow-brand">View Active Orders</Button>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item} className="group cursor-pointer hover:-translate-y-1 transition-all">
                <StatCard label="Matching RFQs" value={rfqs.length} sub="Available to quote" icon={<FileText size={20} className="text-brand-500" />} />
              </motion.div>
              <motion.div variants={item} className="group cursor-pointer hover:-translate-y-1 transition-all">
                <StatCard label="Quotes Sent" value={45} sub="This month" icon={<Users size={20} className="text-blue-500" />} />
              </motion.div>
              <motion.div variants={item} className="group cursor-pointer hover:-translate-y-1 transition-all">
                <StatCard label="Win Rate" value="31%" sub="+4% from last month" icon={<TrendingUp size={20} className="text-success" />} />
              </motion.div>
              <motion.div variants={item} className="group cursor-pointer hover:-translate-y-1 transition-all">
                <StatCard label="Pipeline Value" value="₹1.2M" sub="Active deals" icon={<DollarSign size={20} className="text-brand-600" />} />
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Requirements Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <SectionHeader title="Marketplace Opportunities" subtitle="Active buyer requests matching your capabilities" />
                    <Button variant="ghost" size="sm" className="text-brand-600 hidden sm:flex">View all <ChevronRight size={16} /></Button>
                  </div>
                  
                  <div className="space-y-4">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-white border border-border rounded-xl p-6 h-32"></div>
                      ))
                    ) : rfqs.length === 0 ? (
                      <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <PackageSearch className="text-ink-3" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-ink mb-1">No matches right now</h3>
                        <p className="text-ink-3 max-w-sm">We'll notify you when new buyer requirements match your factory's production capabilities.</p>
                      </Card>
                    ) : (
                      rfqs.map((req, idx) => (
                        <motion.div 
                          key={req.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="group relative bg-white border border-border rounded-2xl p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-300"
                        >
                          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-400 to-brand-600 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1.5">
                                <h3 className="font-display font-bold text-lg text-ink group-hover:text-brand-600 transition-colors">{req.title}</h3>
                                {req.status === 'OPEN' && (
                                  <Badge variant="success" className="animate-pulse-slow">New</Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-ink-3 flex items-center gap-2">
                                <Briefcase size={14} />
                                {req.buyer.companyName || req.buyer.name} 
                                <span className="text-muted-hover">•</span> 
                                Req #{req.id.split('-')[0].toUpperCase()}
                              </p>
                            </div>
                            
                            <div className="text-right shrink-0 bg-surface rounded-xl px-4 py-2 border border-border">
                              <p className="font-display font-bold text-lg text-brand-600">
                                {req.targetPrice ? `₹${req.targetPrice}` : "Open Bid"}
                              </p>
                              <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mt-0.5">Target / {req.unit}</p>
                            </div>
                          </div>
                          
                          <p className="text-ink-2 text-sm mb-5 leading-relaxed bg-surface/50 p-4 rounded-xl border border-border/50">
                            {req.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-[11px] text-ink-3 uppercase font-semibold">Quantity</span>
                                <span className="text-sm font-bold text-ink">{req.quantity} {req.unit}s</span>
                              </div>
                              <div className="h-8 w-px bg-border mx-2"></div>
                              <div className="flex flex-col">
                                <span className="text-[11px] text-ink-3 uppercase font-semibold">Posted</span>
                                <span className="text-sm font-semibold text-ink">{new Date(req.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <Button 
                              variant="primary" 
                              onClick={() => openQuoteModal(req)}
                              className="shadow-brand transform group-hover:-translate-y-0.5 transition-transform"
                            >
                              Quote Now
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Secondary Content */}
              <div className="space-y-6">
                
                {/* Profile Health Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-white to-surface overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <CheckCircle2 size={100} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <CheckCircle2 size={18} />
                        </div>
                        <p className="font-bold text-ink">Verified Factory</p>
                      </div>
                      
                      <p className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3 mt-6">Profile Strength</p>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-3xl font-display font-bold text-ink leading-none">85<span className="text-lg text-ink-3">%</span></span>
                        <span className="text-sm font-medium text-brand-600">Great</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full mb-4 overflow-hidden shadow-inner">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full relative" 
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-ink-2 leading-relaxed">
                        Add 2 more factory photos to reach 100% and rank higher in buyer searches.
                      </p>
                    </div>
                  </Card>
                </motion.div>

                {/* Conversion Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6">
                    <div className="mb-6">
                      <h2 className="font-bold text-ink">Conversion Trend</h2>
                      <p className="text-xs text-ink-3 mt-1">Quotes submitted vs accepted</p>
                    </div>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                          <Tooltip 
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Bar dataKey="quotes" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={12} />
                          <Bar dataKey="accepted" fill="#D97706" radius={[4, 4, 0, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 text-[11px] font-semibold uppercase tracking-wider mt-4 justify-center">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-brand-500 rounded-full"></div> Accepted</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-muted-hover rounded-full"></div> Sent</div>
                    </div>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quote Modal */}
      <AnimatePresence>
        {quoteModalOpen && selectedRfq && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => !submittingQuote && setQuoteModalOpen(false)}></div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative z-10 border border-border overflow-hidden"
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink">Submit Quotation</h2>
                  <p className="text-xs text-ink-3 mt-1 font-medium">Send your best offer to win this deal</p>
                </div>
                <button 
                  onClick={() => setQuoteModalOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-border text-ink-3 hover:text-ink hover:bg-muted transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                <div className="bg-gradient-to-r from-surface to-white border border-border rounded-xl p-4 mb-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink mb-1">{selectedRfq.title}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
                        <p>Req: <strong className="text-ink">#{selectedRfq.id.split('-')[0].toUpperCase()}</strong></p>
                        <p>Qty: <strong className="text-ink">{selectedRfq.quantity} {selectedRfq.unit}</strong></p>
                        <p>Target: <strong className="text-brand-600">{selectedRfq.targetPrice ? `₹${selectedRfq.targetPrice}` : "None"}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {quoteError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl mb-6 flex items-start gap-2">
                        <span className="shrink-0">⚠️</span> {quoteError}
                      </div>
                    </motion.div>
                  )}
                  {quoteSuccess && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="text-sm text-success bg-success-bg border border-success/20 p-3 rounded-xl mb-6 flex items-start gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> {quoteSuccess}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-xs font-bold text-ink-2 uppercase tracking-wide">Unit Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 font-medium">₹</span>
                      <input 
                        type="number" 
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full border border-border bg-surface/50 rounded-xl pl-8 pr-4 py-3 text-sm font-semibold focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-ink-2 uppercase tracking-wide">Production Time</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        placeholder="e.g. 14"
                        className="w-full border border-border bg-surface/50 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 text-sm font-medium">Days</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-ink-2 uppercase tracking-wide">Message to Buyer (Optional)</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Highlight why you're the best fit..."
                      rows={3}
                      className="w-full border border-border bg-surface/50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer Sticky with total */}
              <div className="p-6 border-t border-border bg-surface shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-ink-3">Estimated Value</span>
                  <span className="text-xl font-display font-bold text-ink">
                    ₹{unitPrice ? (parseFloat(unitPrice) * selectedRfq.quantity).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="w-1/3 py-2.5" onClick={() => setQuoteModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" className="w-2/3 py-2.5 shadow-brand text-sm font-bold" onClick={submitQuote} disabled={submittingQuote || !!quoteSuccess}>
                    {submittingQuote ? "Submitting..." : "Send Quote"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
