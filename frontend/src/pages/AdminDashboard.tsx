import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { StatCard, Card, Button, Badge, StatusBadge } from "../components/ui";
import { Users, Factory, ShoppingBag, FileText, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/client";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/verifications')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (pendingRes.data.success) setPending(pendingRes.data.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (profileId: string, status: string) => {
    try {
      await api.put('/admin/verifications/status', { manufacturerProfileId: profileId, status });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update verification", err);
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
      <DashboardNavbar userType="admin" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="admin" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FDFCFB]">
          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
            >
              <h1 className="font-display text-3xl font-extrabold text-ink">Admin Command Center</h1>
              <p className="text-sm font-semibold text-ink-3 mt-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-slow"></span>
                System nominal. All services operational.
              </p>
            </motion.div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <motion.div variants={item}><StatCard label="Total Users" value={stats?.totalUsers || 0} sub="Registered accounts" icon={<Users size={20} className="text-blue-500" />} /></motion.div>
              <motion.div variants={item}><StatCard label="Manufacturers" value={stats?.totalManufacturers || 0} sub="Platform suppliers" icon={<Factory size={20} className="text-brand-500" />} /></motion.div>
              <motion.div variants={item}><StatCard label="Total RFQs" value={stats?.totalRfqs || 0} sub="Sourcing requests" icon={<FileText size={20} className="text-brand-600" />} /></motion.div>
              <motion.div variants={item}><StatCard label="Pending Docs" value={pending.length} sub="Awaiting verification" icon={<AlertCircle size={20} className="text-warning" />} /></motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-8">
              
              <div className="space-y-8">
                {/* Verification queue */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-ink">Verification Queue</h2>
                    {pending.length > 0 && <Badge variant="warning" className="animate-pulse-slow">{pending.length} pending</Badge>}
                  </div>
                  
                  <Card className="overflow-hidden border-border/80">
                    <div className="divide-y divide-border">
                      {pending.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                          <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} /></div>
                          <p className="font-bold text-ink">All caught up!</p>
                          <p className="text-sm text-ink-3">No pending manufacturer verifications.</p>
                        </div>
                      ) : (
                        pending.map((m) => (
                          <div key={m.id} className="p-5 hover:bg-surface transition-colors group">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="font-bold text-ink group-hover:text-brand-600 transition-colors">{m.user?.companyName || m.user?.name}</h3>
                                <p className="text-xs font-semibold text-ink-3 mt-0.5">{m.city || m.factoryAddress} · {m.productionCapacity}</p>
                              </div>
                              <StatusBadge status={m.verificationStatus} />
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
                              <Button variant="primary" size="sm" onClick={() => handleVerify(m.id, 'VERIFIED')} className="shadow-sm">
                                <CheckCircle size={14} /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="font-semibold">
                                <Eye size={14} /> View Docs
                              </Button>
                              <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-bg hover:text-danger ml-auto" onClick={() => handleVerify(m.id, 'REJECTED')}>
                                <XCircle size={14} /> Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* Activity Feed */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="font-display text-xl font-bold text-ink mb-4">Platform Activity</h2>
                  <Card className="border-border/80">
                    <div className="divide-y divide-border">
                      {[
                        { event: "New manufacturer registered", detail: "Solitaire Crafts Pvt. Ltd. · Surat", time: "2h ago", type: "info" },
                        { event: "Order dispute raised", detail: "ORD-1029 · Buyer vs. Silver Peak", time: "4h ago", type: "warning" },
                        { event: "Manufacturer verified", detail: "Golden Craft Studio · Approved", time: "Yesterday", type: "success" },
                        { event: "New requirement posted", detail: "REQ-320 · 500 necklaces", time: "Yesterday", type: "info" },
                      ].map((a, i) => (
                        <div key={i} className="p-4 flex items-start gap-4 hover:bg-surface transition-colors cursor-pointer group">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm ${a.type === "success" ? "bg-success" : a.type === "warning" ? "bg-warning" : "bg-brand-500"}`} />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">{a.event}</p>
                            <p className="text-xs font-medium text-ink-3 mt-0.5">{a.detail}</p>
                          </div>
                          <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider">{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar Panel */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
                
                <Card className="p-5 border-border/80 bg-gradient-to-br from-white to-surface">
                  <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-4">Verification Health</p>
                  {[
                    { label: "Verified", count: 684, color: "bg-success" },
                    { label: "Pending", count: pending.length, color: "bg-warning" },
                    { label: "Rejected", count: 124, color: "bg-danger" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center justify-between text-sm mb-3 last:mb-0">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="font-semibold text-ink-2">{label}</span>
                      </div>
                      <span className="font-bold text-ink">{count}</span>
                    </div>
                  ))}
                </Card>

                <Card className="p-5 border-border/80">
                  <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-4">Top Categories</p>
                  {[
                    { label: "Earrings", pct: 35 },
                    { label: "Necklaces", pct: 28 },
                    { label: "Packaging", pct: 18 },
                    { label: "Rings", pct: 12 },
                  ].map(({ label, pct }) => (
                    <div key={label} className="mb-3.5 last:mb-0">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-ink-2">{label}</span>
                        <span className="font-bold text-brand-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.8 }}
                          className="h-full bg-brand-500 rounded-full" 
                        />
                      </div>
                    </div>
                  ))}
                </Card>

                <Card className="p-5 border-border/80 bg-brand-50 border-brand-100">
                  <p className="text-xs font-extrabold text-brand-700 uppercase tracking-widest mb-4">Quick Actions</p>
                  <div className="flex flex-col gap-2.5">
                    <Button variant="secondary" size="sm" className="w-full justify-start font-bold">Manage Users</Button>
                    <Button variant="secondary" size="sm" className="w-full justify-start font-bold">Export Data CSV</Button>
                  </div>
                </Card>
                
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
