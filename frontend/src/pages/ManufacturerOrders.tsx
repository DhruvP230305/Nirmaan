import { useState, useEffect } from "react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Badge, Button, StatusBadge } from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import api from "../api/client";

export default function ManufacturerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const columns = [
    { id: "PENDING", label: "New Orders", icon: Clock },
    { id: "IN_PRODUCTION", label: "In Production", icon: Package },
    { id: "SHIPPED", label: "Shipped", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-surface">
        <DashboardNavbar userType="manufacturer" />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar type="manufacturer" />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-ink-3">Loading orders...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="manufacturer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="manufacturer" />
        <main className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-muted/30">
          <div className="min-w-[1000px]">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-ink">Order Management</h1>
              <p className="text-sm text-ink-3 mt-0.5">Track and update the status of buyer orders.</p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {columns.map(col => {
                const columnOrders = orders.filter(o => o.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <col.icon size={16} className="text-ink-2" />
                        <h2 className="font-semibold text-ink text-sm">{col.label}</h2>
                      </div>
                      <Badge variant="muted">{columnOrders.length}</Badge>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[500px]">
                      <AnimatePresence>
                        {columnOrders.map((o) => (
                          <motion.div
                            key={o.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                          >
                            <Card className="p-4 cursor-grab active:cursor-grabbing hover:border-brand-500/50 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono font-bold text-ink-3">{o.orderNumber}</span>
                                <span className="text-xs font-bold text-ink">₹{o.totalAmount.toLocaleString()}</span>
                              </div>
                              <h3 className="font-semibold text-ink text-sm mb-1 line-clamp-2">{o.rfq?.title || "Custom Order"}</h3>
                              <p className="text-xs text-ink-3 mb-4">Buyer: {o.buyer?.companyName || o.buyer?.name}</p>

                              <div className="flex gap-2 text-xs">
                                {col.id === "PENDING" && (
                                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-auto" onClick={() => updateOrderStatus(o.id, "IN_PRODUCTION")}>
                                    Start Prod <ArrowRight size={12} className="ml-1" />
                                  </Button>
                                )}
                                {col.id === "IN_PRODUCTION" && (
                                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-auto" onClick={() => updateOrderStatus(o.id, "SHIPPED")}>
                                    Ship Order <ArrowRight size={12} className="ml-1" />
                                  </Button>
                                )}
                                {col.id === "SHIPPED" && (
                                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-auto" onClick={() => updateOrderStatus(o.id, "DELIVERED")}>
                                    Mark Delivered <CheckCircle size={12} className="ml-1" />
                                  </Button>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {columnOrders.length === 0 && (
                        <div className="p-6 border-2 border-dashed border-border rounded-xl text-center text-sm text-ink-3">
                          No orders
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
