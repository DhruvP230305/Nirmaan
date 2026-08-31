import { CheckCircle, XCircle, MessageSquare, FlaskConical, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { VerifiedBadge, StarRating, Button, Badge, Card } from "../components/ui";
import api from "../api/client";

export default function QuoteComparison() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  
  const [rfq, setRfq] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  useEffect(() => {
    const fetchRfqDetails = async () => {
      try {
        const res = await api.get(`/rfqs/${rfqId}`);
        if (res.data.success) {
          setRfq(res.data.data);
          setQuotes(res.data.data.quotes || []);
        }
      } catch (err) {
        console.error("Failed to fetch RFQ", err);
      } finally {
        setLoading(false);
      }
    };
    if (rfqId) fetchRfqDetails();
  }, [rfqId]);

  const acceptQuote = async (quoteId: string) => {
    setIsAccepting(quoteId);
    try {
      const res = await api.put(`/rfqs/quotes/${quoteId}/status`, { status: "ACCEPTED" });
      if (res.data.success) {
        setNotice("Quote accepted successfully! Redirecting to orders...");
        setTimeout(() => {
          navigate("/orders");
        }, 1500);
      }
    } catch (err: any) {
      setNotice(err.response?.data?.message || "Failed to accept quote.");
      setIsAccepting(null);
    }
  };

  const rejectQuote = async (quoteId: string) => {
    try {
      await api.put(`/rfqs/quotes/${quoteId}/status`, { status: "REJECTED" });
      // Update local state to hide it
      setQuotes(quotes.filter(q => q.id !== quoteId));
      setNotice("Quote rejected.");
    } catch (err) {
      setNotice("Failed to reject quote.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-surface">
        <DashboardNavbar userType="buyer" />
        <div className="flex flex-1">
          <Sidebar type="buyer" />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-ink-3">Loading quotes...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="h-screen flex flex-col bg-surface">
        <DashboardNavbar userType="buyer" />
        <div className="flex flex-1">
          <Sidebar type="buyer" />
          <main className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-ink-3">Requirement not found.</p>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </main>
        </div>
      </div>
    );
  }

  const activeQuotes = quotes.filter(q => q.status !== 'REJECTED');

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link to="/requirements" className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to Requirements
              </Link>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-brand-500 uppercase tracking-widest font-bold">RFQ: {rfq.id.split('-')[0]}</p>
                <h1 className="font-display text-3xl font-bold text-ink">{rfq.title}</h1>
                <p className="text-sm text-ink-3">
                  {rfq.quantity} {rfq.unit} · {activeQuotes.length} quotes received
                </p>
              </div>
              
              {notice && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-success/30 bg-success-bg px-4 py-3 text-sm text-success font-medium">
                  {notice}
                </motion.div>
              )}
            </div>

            {activeQuotes.length === 0 ? (
              <Card className="py-16 text-center border-dashed">
                <p className="text-ink text-lg font-semibold mb-2">No quotes available</p>
                <p className="text-ink-3 text-sm mb-4">Manufacturers haven't submitted quotes yet, or you rejected them.</p>
                <Link to="/requirements"><Button variant="outline">Back to Requirements</Button></Link>
              </Card>
            ) : (
              <div className="overflow-x-auto pb-8">
                <motion.div 
                  className="min-w-[800px]"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${activeQuotes.length}, minmax(250px, 1fr))` }}>
                    
                    {/* Header Row */}
                    <div className="flex items-end pb-4">
                      <p className="text-xs font-bold text-ink-3 uppercase tracking-widest">Compare</p>
                    </div>
                    {activeQuotes.map((q, idx) => {
                      const isBestPrice = activeQuotes.every(other => q.unitPrice <= other.unitPrice);
                      return (
                        <motion.div variants={item} key={q.id}>
                          <Card className={`p-5 h-full ${isBestPrice ? "border-brand-500 shadow-[0_0_15px_rgba(217,119,6,0.1)]" : "border-border"}`}>
                            {isBestPrice && (
                              <div className="mb-3">
                                <Badge variant="brand">Best Price</Badge>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-ink">
                                {q.manufacturer.companyName ? q.manufacturer.companyName.substring(0, 2) : "MF"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-ink truncate">{q.manufacturer.companyName || q.manufacturer.name}</p>
                                <VerifiedBadge />
                              </div>
                            </div>
                            <StarRating rating={q.manufacturer.manufacturerProfile?.rating || 0} reviews={q.manufacturer.manufacturerProfile?.reviewCount || 0} />
                          </Card>
                        </motion.div>
                      );
                    })}

                    {/* Price */}
                    <CompareLabel>Price per unit</CompareLabel>
                    {activeQuotes.map((q) => (
                      <CompareCell key={q.id}>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-bold text-2xl text-ink">₹{q.unitPrice}</span>
                          <span className="text-sm text-ink-3">/ {rfq.unit}</span>
                        </div>
                        <p className="text-xs text-ink-3 mt-1">Total: ₹{q.totalPrice.toLocaleString()}</p>
                      </CompareCell>
                    ))}

                    {/* Production Time */}
                    <CompareLabel>Production time</CompareLabel>
                    {activeQuotes.map((q) => (
                      <CompareCell key={q.id}>
                        <span className="text-sm font-semibold text-ink">{q.deliveryTimeDays} days</span>
                      </CompareCell>
                    ))}

                    {/* Notes */}
                    <CompareLabel>Manufacturer Notes</CompareLabel>
                    {activeQuotes.map((q) => (
                      <CompareCell key={q.id} align="start">
                        <p className="text-sm text-ink-2 leading-relaxed">
                          {q.notes || <span className="italic text-ink-3">No additional notes provided.</span>}
                        </p>
                      </CompareCell>
                    ))}

                    {/* Actions */}
                    <div />
                    {activeQuotes.map((q) => (
                      <motion.div variants={item} key={`actions-${q.id}`} className="p-4 rounded-xl border border-border bg-white flex flex-col gap-3">
                        <Button 
                          variant="primary" 
                          className="w-full shadow-sm hover:shadow-md transition-all" 
                          onClick={() => acceptQuote(q.id)}
                          disabled={isAccepting !== null}
                        >
                          {isAccepting === q.id ? "Accepting..." : "Accept Quote"}
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Link to="/messages" className="w-full">
                            <Button variant="outline" className="w-full text-ink-2 border-border">
                              <MessageSquare size={14} className="mr-1" /> Chat
                            </Button>
                          </Link>
                          <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50" onClick={() => rejectQuote(q.id)}>
                            Decline
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function CompareLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center py-5 border-t border-border">
      <span className="text-xs font-bold text-ink-3 uppercase tracking-widest">{children}</span>
    </div>
  );
}

function CompareCell({ children, align = "center" }: { children: React.ReactNode; align?: "center" | "start"; }) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center justify-center" : "items-start text-left"} py-5 px-4 border-t border-border bg-white/50`}>
      {children}
    </div>
  );
}
