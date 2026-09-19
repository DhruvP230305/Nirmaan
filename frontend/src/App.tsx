import { BrowserRouter, Routes, Route, Navigate, useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api/client";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/Auth";
import Discover from "./pages/Discover";
import ProductDetail from "./pages/ProductDetail";
import Manufacturers, { ManufacturerProfile } from "./pages/Manufacturers";
import BuyerDashboard from "./pages/BuyerDashboard";
import PostRequirement from "./pages/PostRequirement";
import QuoteComparison from "./pages/QuoteComparison";
import Messages from "./pages/Messages";
import RequestSample from "./pages/RequestSample";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import ManufacturerOrders from "./pages/ManufacturerOrders";
import ManufacturerProducts from "./pages/ManufacturerProducts";
import AdminDashboard from "./pages/AdminDashboard";
import Packaging from "./pages/Packaging";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailTracker from "./pages/OrderDetailTracker";
import BusinessKitBuilder from "./pages/BusinessKitBuilder";
import {
  CategoriesPage, NotificationsPage, PaymentPage,
  ReviewsPage,
} from "./pages/AdditionalFlows";
import SettingsPage from "./pages/SettingsPage";
import { ForgotPassword, HowItWorks, PortalPage } from "./pages/PortalPages";
import {
  DashboardNavbar
} from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Card, Button, StatusBadge, SectionHeader, StatCard, Chassis } from "./components/ui";
import { getOrders } from "./data/store";
import {
  ShoppingBag, Package2, FileText, Plus, ArrowRight,
} from "lucide-react";

// Lightweight wrapper pages
function RequirementsPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rfqs');
        if (res.data.success) {
          setRequirements(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch requirements", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  return (
    <Chassis>
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto pr-2">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
                  Sourcing RFQ Console
                </span>
                <h1 className="font-display text-3xl font-extrabold text-[#121316] mt-0.5">My Requirements</h1>
                <p className="text-xs text-[#6b7280] font-medium mt-1">Track and compare all active manufacturer quotes</p>
              </div>
              <Link to="/post-requirement">
                <Button variant="primary" withArrow><Plus size={14} /> Post Requirement</Button>
              </Link>
            </div>
            <div className="bento-card bg-white p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/5">
                      {["ID", "Product", "Quantity", "Target Price", "Quotes", "Status", "Date", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-mono-tech font-bold text-[#6b7280] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {loading ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-xs text-[#6b7280]">Loading...</td></tr>
                    ) : requirements.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-xs text-[#6b7280]">No requirements posted yet.</td></tr>
                    ) : requirements.map((r) => (
                      <tr key={r.id} className="hover:bg-[#f9f8f5] transition-colors">
                        <td className="px-4 py-3.5 text-xs font-mono-tech font-bold text-[#6b7280]">{r.id.split('-')[0]}</td>
                        <td className="px-4 py-3.5 text-xs font-bold text-[#121316]">{r.title}</td>
                        <td className="px-4 py-3.5 text-xs text-[#121316]">{r.quantity} {r.unit}</td>
                        <td className="px-4 py-3.5 text-xs font-mono-tech font-bold text-[#121316]">{r.targetPrice ? `₹${r.targetPrice}` : "N/A"}</td>
                        <td className="px-4 py-3.5">
                          {r.quotes && r.quotes.length > 0 ? (
                            <span className="font-mono-tech font-extrabold text-xs text-[#2d62ed] bg-[#eff6ff] px-2 py-0.5 rounded-full">{r.quotes.length} quotes</span>
                          ) : (
                            <span className="text-xs text-[#9ca3af]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3.5 text-xs font-mono-tech text-[#9ca3af]">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3.5">
                          {r.quotes && r.quotes.length > 0 && (
                            <Link to={`/quotes/${r.id}`}>
                              <Button variant="secondary" size="sm">Compare Quotes</Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Chassis>
  );
}



function ManufacturerPortalRoute() {
  const { section = "products" } = useParams();
  return <PortalPage type="manufacturer" section={section} />;
}

function AdminPortalRoute() {
  const { section = "users" } = useParams();
  return <PortalPage type="admin" section={section} />;
}

function SamplesPage() {
  const sampleSteps = ["Request Sample", "Manufacturer Accepted", "Sample Preparing", "Shipped", "Delivered", "Review Sample"];
  return (
    <Chassis>
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto pr-2">
          <div className="max-w-3xl">
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
              Sample Validation Hub
            </span>
            <h1 className="font-display text-3xl font-extrabold text-[#121316] mt-0.5 mb-6">Sample Requests</h1>
            <div className="bento-card p-6 mb-4 bg-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-display font-extrabold text-lg text-[#121316]">925 Sterling Silver Hoop Earrings</p>
                  <p className="text-xs text-[#6b7280]">Artisan Metals Co. · REQ-001</p>
                </div>
                <StatusBadge status="COMPLETED" />
              </div>
              <div className="flex items-center gap-0 overflow-x-auto pb-2 mb-6">
                {sampleSteps.map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-tech font-bold ${i <= 3 ? "bg-[#111111] text-[#d9ff36]" : "bg-[#f4f3ee] text-[#9ca3af]"}`}>{i + 1}</div>
                      <span className="text-[10px] font-semibold text-[#6b7280] mt-1 text-center max-w-14">{s}</span>
                    </div>
                    {i < sampleSteps.length - 1 && (
                      <div className={`h-0.5 w-6 mx-0.5 mb-4 ${i < 3 ? "bg-[#111111]" : "bg-black/10"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center bg-[#f9f8f5] rounded-2xl p-3 border border-black/5">
                  <p className="font-mono-tech font-extrabold text-sm text-[#121316]">₹250</p>
                  <p className="text-[11px] font-medium text-[#6b7280]">Sample Cost</p>
                </div>
                <div className="text-center bg-[#f9f8f5] rounded-2xl p-3 border border-black/5">
                  <p className="font-mono-tech font-extrabold text-sm text-[#121316]">₹120</p>
                  <p className="text-[11px] font-medium text-[#6b7280]">Express Air Shipping</p>
                </div>
                <div className="text-center bg-[#f9f8f5] rounded-2xl p-3 border border-black/5">
                  <p className="font-mono-tech font-extrabold text-sm text-[#2d62ed]">Aug 24</p>
                  <p className="text-[11px] font-medium text-[#6b7280]">Expected Delivery</p>
                </div>
              </div>
              <p className="text-xs font-mono-tech text-[#6b7280] mb-4">Tracking: DTDC-98234 — In Transit (Customs Cleared)</p>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="primary" size="sm" disabled>Approve Sample</Button>
                <Button variant="outline" size="sm" disabled>Reject Sample</Button>
                <Button variant="ghost" size="sm" disabled>Request Changes</Button>
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-2.5">Actions unlock automatically once courier marks delivered</p>
            </div>
          </div>
        </main>
      </div>
    </Chassis>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Chassis>
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bento-card p-12 text-center max-w-md bg-white">
          <div className="font-display text-7xl font-extrabold text-black/10 mb-2">404</div>
          <h1 className="font-display text-2xl font-extrabold text-[#121316] mb-2">Page Not Found</h1>
          <p className="text-xs text-[#6b7280] mb-6">The sourcing link you requested does not exist or has been relocated.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="sm" onClick={() => navigate(-1)}>Go Back</Button>
            <Link to="/"><Button variant="outline" size="sm">Home</Button></Link>
          </div>
        </div>
      </div>
    </Chassis>
  );
}

import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'MANUFACTURER') return <Navigate to="/mfr/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/manufacturers" element={<Manufacturers />} />
          <Route path="/manufacturer/:id" element={<ManufacturerProfile />} />
          <Route path="/packaging" element={<ProtectedRoute allowedRoles={['BUYER']}><Packaging /></ProtectedRoute>} />
          <Route path="/categories" element={<CategoriesPage />} />

          {/* Buyer dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/requirements" element={<ProtectedRoute allowedRoles={['BUYER']}><RequirementsPage /></ProtectedRoute>} />
          <Route path="/quotes/:rfqId" element={<ProtectedRoute allowedRoles={['BUYER']}><QuoteComparison /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['BUYER']}><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute allowedRoles={['BUYER']}><OrderDetailTracker /></ProtectedRoute>} />
          <Route path="/samples" element={<ProtectedRoute allowedRoles={['BUYER']}><SamplesPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute allowedRoles={['BUYER', 'MANUFACTURER']}><Messages /></ProtectedRoute>} />
          <Route path="/post-requirement" element={<ProtectedRoute allowedRoles={['BUYER']}><PostRequirement /></ProtectedRoute>} />
          <Route path="/business-kit" element={<ProtectedRoute allowedRoles={['BUYER']}><BusinessKitBuilder /></ProtectedRoute>} />
          <Route path="/payment/:orderId" element={<ProtectedRoute allowedRoles={['BUYER']}><PaymentPage /></ProtectedRoute>} />
          <Route path="/reviews/:orderId" element={<ProtectedRoute allowedRoles={['BUYER']}><ReviewsPage /></ProtectedRoute>} />
          <Route path="/samples/request/:productId" element={<ProtectedRoute allowedRoles={['BUYER']}><RequestSample /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['BUYER', 'MANUFACTURER']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['BUYER', 'MANUFACTURER', 'ADMIN']}><SettingsPage /></ProtectedRoute>} />

          {/* Manufacturer */}
          <Route path="/mfr/dashboard" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><ManufacturerDashboard /></ProtectedRoute>} />
          <Route path="/mfr/orders" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><ManufacturerOrders /></ProtectedRoute>} />
          <Route path="/mfr/products" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><ManufacturerProducts /></ProtectedRoute>} />
          <Route path="/mfr/messages" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><Messages /></ProtectedRoute>} />
          <Route path="/mfr/settings" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><SettingsPage /></ProtectedRoute>} />
          <Route path="/mfr/:section" element={<ProtectedRoute allowedRoles={['MANUFACTURER']}><ManufacturerPortalRoute /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/:section" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPortalRoute /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
