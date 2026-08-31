import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, PackageCheck, Truck, Cog, CheckCircle, Clock } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Badge, Button } from "../components/ui";
import api from "../api/client";

export default function OrderDetailTracker() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would fetch order details from backend
    // Since we don't have a specific GET /orders/:id yet, we'll fetch all and find it
    const fetchOrder = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          const found = res.data.data.find((o: any) => o.id === orderId);
          setOrder(found);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-surface">
        <DashboardNavbar userType="buyer" />
        <div className="flex flex-1">
          <Sidebar type="buyer" />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-ink-3">Loading order details...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col bg-surface">
        <DashboardNavbar userType="buyer" />
        <div className="flex flex-1">
          <Sidebar type="buyer" />
          <main className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-ink-3">Order not found.</p>
            <Link to="/orders"><Button variant="outline">Back to Orders</Button></Link>
          </main>
        </div>
      </div>
    );
  }

  // Derive active step from status
  const statusSteps = [
    { id: "PENDING", label: "Order Placed", icon: Clock },
    { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
    { id: "IN_PRODUCTION", label: "In Production", icon: Cog },
    { id: "SHIPPED", label: "Shipped", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: PackageCheck },
  ];

  const activeIndex = statusSteps.findIndex(s => s.id === order.status);

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to Orders
              </Link>
              <h1 className="font-display text-3xl font-bold text-ink">Order Tracker</h1>
              <p className="text-sm text-ink-3">Order #{order.orderNumber}</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-8 mb-6 border-brand-500 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <h2 className="text-lg font-bold text-ink mb-8 relative z-10">Production Timeline</h2>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex-1 flex flex-row md:flex-col items-center relative mb-8 md:mb-0 w-full">
                        {/* Line connector */}
                        {idx !== statusSteps.length - 1 && (
                          <div className={`hidden md:block absolute top-6 left-1/2 w-full h-1 -z-10 ${idx < activeIndex ? 'bg-brand-500' : 'bg-muted'}`} />
                        )}
                        {idx !== statusSteps.length - 1 && (
                          <div className={`md:hidden absolute left-6 top-12 h-full w-1 -z-10 ${idx < activeIndex ? 'bg-brand-500' : 'bg-muted'}`} />
                        )}

                        <motion.div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mb-3 ${isCompleted ? 'bg-brand-500 text-white' : 'bg-muted text-ink-3'} ${isActive ? 'ring-4 ring-brand-500/20' : ''}`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isActive ? 1.1 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Icon size={24} />
                        </motion.div>
                        
                        <div className="ml-4 md:ml-0 md:text-center flex-1">
                          <p className={`font-bold ${isCompleted ? 'text-ink' : 'text-ink-3'}`}>{step.label}</p>
                          {isActive && <Badge variant="brand" className="mt-1">Current Phase</Badge>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 h-full">
                  <h3 className="font-bold text-ink mb-4 border-b border-border pb-2">Order Details</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-3">Product</dt>
                      <dd className="font-medium text-ink">{order.rfq?.title || "Custom Product"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-3">Manufacturer</dt>
                      <dd className="font-medium text-ink">{order.manufacturer?.companyName || order.manufacturer?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-3">Quantity</dt>
                      <dd className="font-medium text-ink">{order.quantity}</dd>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-border">
                      <dt className="font-bold text-ink">Total Amount</dt>
                      <dd className="font-display font-bold text-lg text-ink">₹{order.totalAmount.toLocaleString()}</dd>
                    </div>
                  </dl>
                  {order.status === 'PENDING' && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Link to={`/payment/${order.id}`} className="w-full">
                        <Button variant="primary" className="w-full text-center block">Proceed to Payment</Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 h-full">
                  <h3 className="font-bold text-ink mb-4 border-b border-border pb-2">Shipping Information</h3>
                  <p className="text-sm text-ink-3 mb-4">
                    The manufacturer will ship the products to this address once production is completed.
                  </p>
                  <div className="bg-muted p-4 rounded-xl">
                    <p className="text-sm text-ink font-medium">{order.shippingAddress || 'Address provided at checkout.'}</p>
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
