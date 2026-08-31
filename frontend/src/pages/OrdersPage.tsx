import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, StatusBadge } from "../components/ui";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-ink mb-2">My Orders</h1>
            <p className="text-sm text-ink-3 mb-6">Track and manage your bulk orders in production.</p>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted rounded-xl"></div>
                <div className="h-32 bg-muted rounded-xl"></div>
              </div>
            ) : orders.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="py-20 text-center border-dashed">
                  <ShoppingBag size={40} className="text-brand-500/50 mx-auto mb-4" />
                  <p className="font-display text-lg font-bold text-ink mb-1">No orders yet</p>
                  <p className="text-sm text-ink-3 max-w-md mx-auto mb-6">Your orders will appear here once you accept a quote from a manufacturer.</p>
                  <Link to="/requirements">
                    <Button variant="primary">View My Requirements</Button>
                  </Link>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-4">
                {orders.map((o, idx) => (
                  <motion.div 
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-0 overflow-hidden hover:border-brand-500/50 transition-colors">
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs font-bold bg-muted text-ink px-2 py-1 rounded">{o.orderNumber}</span>
                            <StatusBadge status={o.status} />
                          </div>
                          <h3 className="font-bold text-ink text-lg mb-1">{o.rfq?.title || "Custom Order"}</h3>
                          <p className="text-sm text-ink-3">
                            Manufacturer: <span className="font-medium text-ink-2">{o.manufacturer?.companyName || o.manufacturer?.name}</span>
                          </p>
                        </div>
                        
                        <div className="flex flex-row md:flex-col gap-6 md:gap-1 text-right shrink-0">
                          <div>
                            <p className="text-xs text-ink-3">Total Amount</p>
                            <p className="font-display font-bold text-lg text-ink">₹{o.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-3">Quantity</p>
                            <p className="font-semibold text-ink-2">{o.quantity} {o.rfq?.unit || 'pcs'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 border-t border-border flex items-center justify-between">
                        <p className="text-xs text-ink-3">Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
                        <Link to={`/orders/${o.id}`}>
                          <Button variant="outline" size="sm" className="bg-white hover:bg-brand-50">
                            Track Timeline <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
