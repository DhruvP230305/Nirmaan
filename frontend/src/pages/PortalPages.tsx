import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, Factory, Package, Plus, ShieldCheck, Users } from "lucide-react";
import { DashboardNavbar, default as Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Badge, Button, Card, Input, SectionHeader, StatusBadge, VerifiedBadge } from "../components/ui";
import api from "../api/client";

export function HowItWorks() {
  const steps = ["Post a requirement", "Compare verified quotes", "Request a sample", "Place your order", "Source packaging", "Receive and sell"];
  return <div className="min-h-screen bg-[#FAFAFA]"><Navbar /><main className="max-w-5xl mx-auto px-4 sm:px-6 py-16"><p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-3">A clearer sourcing journey</p><h1 className="font-display text-4xl font-bold text-[#111827]">From product idea to ready-to-sell inventory.</h1><p className="max-w-2xl text-lg text-[#6B7280] mt-4">Nirmaan keeps manufacturers, samples, quotes, packaging, and order updates in one focused workspace.</p><div className="grid md:grid-cols-3 gap-4 mt-12">{steps.map((step, index) => <Card key={step} className="p-5"><span className="font-display text-4xl font-bold text-[#E0E7FF]">0{index + 1}</span><h2 className="font-semibold mt-5">{step}</h2><p className="text-sm text-[#6B7280] mt-2">A simple checkpoint with clear next steps and no hidden sourcing language.</p></Card>)}</div><Link to="/register"><Button variant="primary" size="lg" className="mt-10">Start sourcing <ArrowRight size={16} /></Button></Link></main></div>;
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6"><Card className="w-full max-w-md p-7"><Link to="/" className="font-display font-bold text-xl text-[#111827]">Nirmaan<span className="text-[#4F46E5]">.</span></Link>{sent ? <div className="mt-10 text-center"><div className="w-12 h-12 mx-auto rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center"><Check size={22} /></div><h1 className="font-display text-2xl font-bold mt-4">Check your inbox</h1><p className="text-sm text-[#6B7280] mt-2">If an account exists for that email, we sent reset instructions.</p><Link to="/login"><Button variant="outline" className="mt-6">Back to login</Button></Link></div> : <><h1 className="font-display text-2xl font-bold text-[#111827] mt-10">Reset your password</h1><p className="text-sm text-[#6B7280] mt-2 mb-6">Enter your account email and we’ll send a secure reset link.</p><Input label="Email address" type="email" placeholder="you@example.com" /><Button variant="primary" className="w-full mt-5" onClick={() => setSent(true)}>Send reset link <ArrowRight size={15} /></Button><Link to="/login" className="block text-center text-sm text-[#4F46E5] font-semibold mt-5">Back to login</Link></>}</Card></div>;
}

type PortalType = "manufacturer" | "admin";
const manufacturerSections: Record<string, { title: string; description: string; icon: React.ElementType }>= {
  products: { title: "Product catalogue", description: "Manage products buyers can discover and request quotes for.", icon: Package },
  requirements: { title: "Matching requirements", description: "Review buyer requirements that match your capabilities.", icon: FileText },
  quotes: { title: "Quotes", description: "Track submitted quotes and buyer decisions.", icon: FileText },
  samples: { title: "Sample requests", description: "Prepare, ship, and update sample requests.", icon: Package },
  orders: { title: "Orders", description: "Keep production and shipping status current for buyers.", icon: Package },
  messages: { title: "Messages", description: "Keep requirement and order conversations in one place.", icon: FileText },
  reviews: { title: "Reviews", description: "See buyer feedback and your service rating.", icon: ShieldCheck },
  analytics: { title: "Analytics", description: "Understand profile views, responses, quotes, and orders.", icon: Users },
  verification: { title: "Verification", description: "Complete business checks and maintain your verified status.", icon: ShieldCheck },
  settings: { title: "Manufacturer settings", description: "Update business information and notification preferences.", icon: Factory },
};
const adminSections = ["users", "manufacturers", "verification", "products", "requirements", "quotes", "orders", "payments", "reviews", "packaging", "reports", "settings"];

export function PortalPage({ type, section }: { type: PortalType; section: string }) {
  const isManufacturer = type === "manufacturer";
  const [action, setAction] = useState("");
  const [dynamicRows, setDynamicRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (type === 'admin') {
          if (section === 'users') {
            const res = await api.get('/admin/users');
            if (res.data.success) {
              setDynamicRows(res.data.data.map((u: any) => ({
                name: u.companyName || u.name,
                meta: `${u.role} · ${u.email}`,
                status: u.isVerified ? 'Verified' : 'Pending'
              })));
            }
          } else if (section === 'manufacturers') {
            const res = await api.get('/admin/manufacturers');
            if (res.data.success) {
              setDynamicRows(res.data.data.map((m: any) => ({
                name: m.user?.companyName || m.user?.name,
                meta: `${m.city || m.factoryAddress} · Rating: ${m.rating}`,
                status: m.verificationStatus === 'VERIFIED' ? 'Verified' : m.verificationStatus
              })));
            }
          }
        } else if (type === 'manufacturer') {
          if (section === 'requirements') {
            const res = await api.get('/rfqs');
            if (res.data.success) {
              setDynamicRows(res.data.data.map((rfq: any) => ({
                name: rfq.title,
                meta: `${rfq.quantity} ${rfq.unit} · Target ₹${rfq.targetPrice}/pc`,
                status: rfq.status
              })));
            }
          } else if (section === 'orders') {
            const res = await api.get('/orders');
            if (res.data.success) {
              setDynamicRows(res.data.data.map((order: any) => ({
                name: order.product?.title || `Order ${order.orderNumber}`,
                meta: `${order.quantity} pcs · Total ₹${order.totalAmount}`,
                status: order.status
              })));
            }
          } else if (section === 'samples') {
            const res = await api.get('/samples');
            if (res.data.success) {
              setDynamicRows(res.data.data.map((sample: any) => ({
                name: sample.product?.title || `Sample ID: ${sample.id.slice(0, 8)}`,
                meta: `${sample.quantity} pcs · ₹${sample.price}`,
                status: sample.status
              })));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch portal data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, section]);

  const manufacturerSection = manufacturerSections[section] ?? manufacturerSections.products;
  const title = isManufacturer ? manufacturerSection.title : `${section[0].toUpperCase()}${section.slice(1)}`;
  const description = isManufacturer ? manufacturerSection.description : `Review and manage ${section} across the Nirmaan marketplace.`;
  const Icon = isManufacturer ? manufacturerSection.icon : section === "verification" ? ShieldCheck : section === "manufacturers" ? Factory : Users;
  
  let rows = isManufacturer ? [{ name: "Custom Logo Earrings", meta: "200 pieces · Target ₹90/pc", status: "New" }, { name: "Gold-Plated Hoops", meta: "500 pieces · Deadline Sep 20", status: "Review" }, { name: "Charm Necklaces", meta: "300 pieces · Sample required", status: "Open" }] : [{ name: "Artisan Metals Co.", meta: "Verification documents submitted", status: "Pending" }, { name: "Golden Craft Studio", meta: "4.6 rating · Mumbai", status: "Verified" }, { name: "Silver Peak Industries", meta: "Product catalogue review", status: "Review" }];
  
  // Use dynamic rows for the sections we implemented API calls for
  if (dynamicRows.length > 0 || (isManufacturer && ['requirements', 'orders', 'samples'].includes(section)) || (type === 'admin' && ['users', 'manufacturers'].includes(section))) {
    rows = dynamicRows;
  }

  return <div className="h-screen flex flex-col bg-[#FAFAFA]"><DashboardNavbar userType={type} /><div className="flex flex-1 overflow-hidden"><Sidebar type={type} /><main className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="max-w-5xl"><div className="flex items-start justify-between gap-4 mb-7"><div><p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">{isManufacturer ? "Manufacturer portal" : "Admin panel"}</p><h1 className="font-display text-2xl font-bold text-[#111827]">{title}</h1><p className="text-sm text-[#6B7280] mt-1">{description}</p></div><Button variant="primary" onClick={() => setAction("New workflow started")}>{isManufacturer && section === "products" ? <><Plus size={15} /> Add product</> : "Create action"}</Button></div>{action && <div className="mb-5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm text-[#065F46]">{action}</div>}<div className="grid sm:grid-cols-3 gap-4 mb-7"><Card className="p-4"><p className="text-xs text-[#6B7280]">Total items</p><p className="font-display text-2xl font-bold mt-1">{rows.length}</p></Card><Card className="p-4"><p className="text-xs text-[#6B7280]">Needs attention</p><p className="font-display text-2xl font-bold mt-1">{rows.filter(r => r.status === 'PENDING' || r.status === 'New' || r.status === 'OPEN' || r.status === 'REQUESTED').length}</p></Card><Card className="p-4"><p className="text-xs text-[#6B7280]">Status</p><p className="font-display text-2xl font-bold mt-1">{loading ? '...' : rows.length > 0 ? 'Active' : 'Empty'}</p></Card></div><Card><div className="p-5 border-b border-[#F3F4F6] flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center"><Icon size={17} /></div><SectionHeader title={isManufacturer ? "Work queue" : "Marketplace queue"} subtitle="Use the actions to move each item forward." /></div><div className="divide-y divide-[#F3F4F6]">
  {loading ? <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div> : rows.length === 0 ? <div className="py-12 text-center"><div className="w-16 h-16 rounded-2xl bg-muted text-ink-3 mx-auto flex items-center justify-center mb-4"><Icon size={24} /></div><h3 className="font-display font-bold text-lg mb-1">No items found</h3><p className="text-sm text-ink-3">There are currently no items in this section.</p></div> : rows.map((row) => <div key={row.name} className="p-4 flex items-center gap-4"><div className="flex-1"><p className="font-semibold text-sm text-[#111827]">{row.name}</p><p className="text-xs text-[#6B7280] mt-1">{row.meta}</p></div>{row.status === "Verified" && <VerifiedBadge />}{row.status !== "Verified" && <StatusBadge status={row.status} />}<Button variant="outline" size="sm" onClick={() => setAction(`${row.name} is now selected for review.`)}>Review</Button></div>)}</div></Card></div></main></div></div>;
}

export const manufacturerSectionsList = Object.keys(manufacturerSections);
export const adminSectionsList = adminSections;
