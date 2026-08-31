import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, ChevronRight, CreditCard, FileText, Package,
  Settings, ShieldCheck, Star, Wallet,
} from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Badge, Button, Card, Input, SectionHeader, StatusBadge, VerifiedBadge } from "../components/ui";
import { categories, packagingProducts } from "../data/mock";
import { addOrder, getSelectedQuote } from "../data/store";
import api from "../api/client";
import { parseImages } from "../utils/image";

function BuyerShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={wide ? "max-w-6xl" : "max-w-4xl"}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">Explore the marketplace</p><h1 className="font-display text-3xl font-bold text-[#111827]">Find your next product category</h1><p className="text-[#6B7280] mt-2">Start with a category, then compare verified manufacturers and low minimum orders.</p></div>
          <Link to="/discover"><Button variant="outline" className="hidden sm:flex">Browse all products <ArrowRight size={15} /></Button></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => <Link key={category.id} to={`/discover?category=${category.id}`} className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#4F46E5] transition-colors"><div className="aspect-[4/3] overflow-hidden bg-[#F3F4F6]"><img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div><div className="p-4"><div className="flex items-center justify-between"><h2 className="font-semibold text-[#111827]">{category.name}</h2><ChevronRight size={16} className="text-[#9CA3AF]" /></div><p className="text-sm text-[#6B7280] mt-1">{category.suppliers} verified suppliers</p><span className="text-xs font-semibold text-[#4F46E5] inline-block mt-4">Explore category</span></div></Link>)}
        </div>
      </main>
    </div>
  );
}

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          const found = res.data.data.find((o: any) => o.id === orderId);
          setOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const completePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Payment Order
      const createRes = await api.post('/payments', {
        orderId,
        amount: order.totalAmount,
        provider: 'RAZORPAY'
      });
      const paymentOrder = createRes.data.data;

      // Simulate Razorpay UI wait
      await new Promise(r => setTimeout(r, 1500));

      // 2. Verify Payment
      await api.post('/payments/verify', {
        paymentId: paymentOrder.paymentId,
        providerPaymentId: `rzp_sim_${Date.now()}`,
        signature: 'simulated_signature'
      });
      
      setPaid(true);
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <BuyerShell><div className="flex justify-center mt-20"><div className="animate-pulse text-ink-3">Loading order details...</div></div></BuyerShell>;
  if (!order) return <BuyerShell><div className="flex flex-col items-center mt-20"><p className="mb-4">Order not found.</p><Button variant="outline" onClick={() => navigate('/orders')}>Back to Orders</Button></div></BuyerShell>;

  if (paid) {
    return (
      <BuyerShell>
        <Card className="max-w-lg mx-auto mt-12 p-8 text-center border-success border-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="w-16 h-16 rounded-full bg-success-bg text-success flex items-center justify-center mx-auto mb-6">
            <Check size={32} strokeWidth={3} />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Payment Successful</h1>
          <p className="text-sm text-ink-3 mt-3 mb-8">
            Your payment for order <span className="font-mono text-ink font-bold">{order.orderNumber}</span> has been confirmed. The manufacturer is now preparing production.
          </p>
          <Link to={`/orders/${orderId}`}>
            <Button variant="primary" className="w-full justify-center py-3">Track Production <ArrowRight size={18} className="ml-2" /></Button>
          </Link>
        </Card>
      </BuyerShell>
    );
  }
  
  return (
    <BuyerShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Review & Pay</h1>
        <p className="text-sm text-ink-3 mt-1">Complete your payment securely to start production.</p>
      </div>
      
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <Card className="p-6 border-border shadow-sm">
          <SectionHeader title="Payment Method" subtitle="Secure checkout powered by Razorpay." />
          <div className="border-2 border-brand-500 bg-brand-50 rounded-xl p-5 flex items-center gap-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-brand-500 shrink-0 relative z-10">
              <CreditCard size={24} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-ink text-lg">Razorpay Checkout</p>
              <p className="text-sm text-ink-3">Cards, UPI, NetBanking, Wallets</p>
            </div>
            <ShieldCheck size={24} className="text-success ml-auto relative z-10" />
          </div>
          <Input label="Purchase Order Reference (Optional)" placeholder="e.g. PO-2026-001" className="mb-8" />
          
          <div className="mt-8 flex gap-3">
            <Button variant="primary" className="flex-1 py-4 justify-center" onClick={completePayment} disabled={isProcessing}>
              {isProcessing ? "Processing Payment securely..." : "Proceed to Payment"} <ArrowRight size={18} className="ml-2" />
            </Button>
            <Link to={`/orders/${orderId}`}>
              <Button variant="outline" className="py-4">Cancel</Button>
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 h-fit border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
              <Wallet size={20} />
            </div>
            <h2 className="font-display font-bold text-xl text-ink">Order Summary</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-ink-3 line-clamp-2 pr-4">{order.product?.title || order.rfq?.title || "Custom product order"} <span className="font-bold text-ink">x{order.quantity}</span></span>
              <span className="font-bold text-ink shrink-0">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-ink-3">Shipping Estimate</span>
              <span className="font-bold text-ink shrink-0">₹0</span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-ink-3">Taxes & Fees</span>
              <span className="text-ink-3 italic shrink-0">Included</span>
            </div>
          </div>
          
          <div className="border-t border-border pt-5 flex justify-between items-center bg-muted/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <span className="font-bold text-ink-2">Total Amount</span>
            <span className="font-display text-3xl font-bold text-ink">₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </Card>
      </div>
    </BuyerShell>
  );
}

export function BusinessKitPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/packaging/products');
        if (res.data.success) {
          // If the DB is empty, use the mock products as a fallback for the UI
          if (res.data.data.length > 0) {
            setProducts(res.data.data);
          } else {
            setProducts(packagingProducts as any); 
          }
        }
      } catch (err) {
        console.error(err);
        setProducts(packagingProducts as any); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  
  const total = selected.reduce((sum, id) => {
    const p = products.find((item) => item.id === id);
    return sum + (p?.price ?? 0) * (p?.minOrderQuantity ?? 200);
  }, 17600);

  const buildKit = async () => {
    setIsSubmitting(true);
    try {
      // Create an order for each selected packaging product
      for (const id of selected) {
        const product = products.find(p => p.id === id);
        // Only attempt to POST if it's a real DB product (has supplierId or something real)
        // If it's mock data, this might fail, but we'll try catching
        if (product && !product.supplier) {
          // Skip API call for mock products to avoid 404s
          continue; 
        }
        await api.post('/packaging/orders', {
          packagingProductId: id,
          quantity: product?.minOrderQuantity || 200,
        });
      }
      alert("Business kit orders placed successfully!");
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert("Error placing kit orders. Some products might be mock data.");
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <BuyerShell><div className="flex justify-center mt-20"><div className="animate-pulse text-ink-3">Loading packaging options...</div></div></BuyerShell>;

  return (
    <BuyerShell wide>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">One order-ready bundle</p>
        <h1 className="font-display text-3xl font-bold text-ink">Build Your Business Kit</h1>
        <p className="text-sm text-ink-3 mt-1">Pair your product with the packaging and brand details customers remember.</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="grid sm:grid-cols-2 gap-5">
          {products.map((item) => { 
            const isSelected = selected.includes(item.id); 
            return (
              <Card key={item.id} className={`overflow-hidden transition-all duration-200 ${isSelected ? "border-brand-500 ring-1 ring-brand-500" : "border-border hover:border-brand-300"}`}>
                <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                  <img src={item.image || parseImages(item.images, "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?auto=format&fit=crop&q=80&w=800")} alt={item.title || item.name} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between gap-2 items-start mb-1">
                    <h2 className="font-semibold text-sm text-ink line-clamp-1">{item.title || item.name}</h2>
                    {item.supplier && <VerifiedBadge />}
                  </div>
                  <p className="text-xs text-ink-3 mb-3">{item.supplier?.companyName || item.supplier || "Verified Supplier"}</p>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <span className="font-bold text-lg text-ink">₹{item.price}</span>
                      <span className="font-normal text-xs text-ink-3"> / piece</span>
                    </div>
                    <Badge variant="muted" className="text-[10px]">Min {item.minOrderQuantity || item.moq}</Badge>
                  </div>
                  
                  <Button 
                    variant={isSelected ? "secondary" : "outline"} 
                    className={`w-full mt-5 ${isSelected ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : ""}`}
                    onClick={() => toggle(item.id)}
                  >
                    {isSelected ? "Added to Kit" : "Add to Kit"}
                  </Button>
                </div>
              </Card>
            ); 
          })}
        </div>
        
        <div className="relative">
          <Card className="p-6 sticky top-6 border-border shadow-md">
            <h2 className="font-display font-bold text-xl text-ink mb-6 pb-4 border-b border-border">Kit Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-ink-3 pr-4">Custom Product Order <span className="font-bold text-ink">× 200</span></span>
                <strong className="text-ink shrink-0">₹17,600</strong>
              </div>
              
              {selected.map((id) => { 
                const item = products.find((entry) => entry.id === id); 
                if (!item) return null;
                const qty = item.minOrderQuantity || item.moq || 200;
                return (
                  <div key={id} className="flex justify-between gap-3 text-sm">
                    <span className="text-ink-3 pr-4">{item.title || item.name} <span className="font-bold text-ink">× {qty}</span></span>
                    <strong className="text-ink shrink-0">₹{(item.price * qty).toLocaleString()}</strong>
                  </div>
                ); 
              })}
            </div>
            
            <div className="border-t border-border pt-5 mt-2 flex justify-between items-center bg-muted/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <span className="font-bold text-ink-2">Estimated Total</span>
              <span className="font-display text-2xl font-bold text-ink">₹{total.toLocaleString()}</span>
            </div>
            
            <div className="mt-12">
              <Button variant="primary" className="w-full py-3 text-base" onClick={buildKit} disabled={!selected.length || isSubmitting}>
                {isSubmitting ? "Processing..." : "Build My Kit"} <ArrowRight size={18} className="ml-2" />
              </Button>
              {!selected.length && <p className="text-xs text-center text-ink-3 mt-3">Select at least one packaging item to continue</p>}
            </div>
          </Card>
        </div>
      </div>
    </BuyerShell>
  );
}

export function NotificationsPage() { return <BuyerShell><div className="mb-6"><h1 className="font-display text-2xl font-bold text-[#111827]">Notifications</h1><p className="text-sm text-[#6B7280] mt-1">Stay current on quotes, samples, orders, and payments.</p></div><Card><div className="divide-y divide-[#F3F4F6]">{[{title:"New quote received", desc:"A verified manufacturer quoted on your custom earrings requirement.", time:"12 min ago", icon: FileText, unread:true},{title:"Sample shipped", desc:"Your sample from Artisan Metals Co. is in transit.", time:"Yesterday", icon: Package, unread:true},{title:"Payment successful", desc:"Order ORD-1041 has been confirmed for production.", time:"2 days ago", icon: CreditCard, unread:false},{title:"Manufacturer verification approved", desc:"Your saved manufacturer is now fully verified.", time:"4 days ago", icon: ShieldCheck, unread:false}].map((item) => <div key={item.title} className="p-4 flex gap-3"><div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0"><item.icon size={17} /></div><div className="flex-1"><div className="flex items-center gap-2"><p className="font-semibold text-sm text-[#111827]">{item.title}</p>{item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />}</div><p className="text-sm text-[#6B7280] mt-1">{item.desc}</p><p className="text-xs text-[#9CA3AF] mt-2">{item.time}</p></div></div>)}</div></Card></BuyerShell>; }



export function ReviewsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          const found = res.data.data.find((o: any) => o.id === orderId);
          setOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const submitReview = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        orderId,
        manufacturerId: order.manufacturerId,
        rating,
        qualityRating,
        deliveryRating,
        comment
      });
      alert("Review submitted successfully!");
      navigate('/orders');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <BuyerShell><div className="flex justify-center mt-20"><div className="animate-pulse text-ink-3">Loading order details...</div></div></BuyerShell>;
  if (!order) return <BuyerShell><div className="flex flex-col items-center mt-20"><p className="mb-4">Order not found.</p><Button variant="outline" onClick={() => navigate('/orders')}>Back to Orders</Button></div></BuyerShell>;

  return (
    <BuyerShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Submit Review</h1>
        <p className="text-sm text-ink-3 mt-1">Share useful feedback after your order is complete.</p>
      </div>
      
      <Card className="p-6 max-w-2xl border-border shadow-sm">
        <div className="flex items-center gap-5 mb-8 pb-5 border-b border-border">
          <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
            <Star size={24} fill="currentColor" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-ink line-clamp-1">{order.product?.title || order.rfq?.title || "Custom product order"}</h2>
            <p className="text-sm text-ink-3 mt-0.5">{order.manufacturer.companyName || order.manufacturer.name} · Order {order.orderNumber}</p>
          </div>
          <StatusBadge status="Delivered" />
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold text-ink mb-3">Overall Experience</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setRating(r)} className={`${rating >= r ? "text-warning" : "text-muted-foreground"} hover:scale-110 transition-transform`}>
                  <Star size={28} fill={rating >= r ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-ink-2 mb-2">Quality</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} onClick={() => setQualityRating(r)} className={`${qualityRating >= r ? "text-warning" : "text-muted-foreground"}`}>
                    <Star size={20} fill={qualityRating >= r ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-2 mb-2">Delivery Time</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} onClick={() => setDeliveryRating(r)} className={`${deliveryRating >= r ? "text-warning" : "text-muted-foreground"}`}>
                    <Star size={20} fill={deliveryRating >= r ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-bold text-ink mb-3">Written Review</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other buyers about quality, communication, and delivery..." 
              className="w-full min-h-32 border border-border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-surface resize-y" 
            />
          </div>
        </div>
        
        <div className="mt-8 flex gap-3">
          <Button variant="primary" onClick={submitReview} disabled={isSubmitting} className="py-3 px-6">
            {isSubmitting ? "Publishing..." : "Publish Review"}
          </Button>
          <Button variant="outline" onClick={() => navigate(`/orders/${orderId}`)}>Cancel</Button>
        </div>
      </Card>
    </BuyerShell>
  );
}