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
import { Card, Button, StatusBadge, SectionHeader, StatCard } from "./components/ui";
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
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#111827]">My Requirements</h1>
                <p className="text-sm text-[#6B7280] mt-0.5">Track all your sourcing requests</p>
              </div>
              <Link to="/post-requirement">
                <Button variant="primary"><Plus size={15} /> Post Requirement</Button>
              </Link>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F3F4F6]">
                      {["ID", "Product", "Quantity", "Target Price", "Quotes", "Status", "Date", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {loading ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-[#6B7280]">Loading...</td></tr>
                    ) : requirements.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-[#6B7280]">No requirements posted yet.</td></tr>
                    ) : requirements.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-[#6B7280]">{r.id.split('-')[0]}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#111827]">{r.title}</td>
                        <td className="px-4 py-3 text-sm text-[#374151]">{r.quantity} {r.unit}</td>
                        <td className="px-4 py-3 text-sm text-[#374151]">{r.targetPrice ? `₹${r.targetPrice}` : "N/A"}</td>
                        <td className="px-4 py-3">
                          {r.quotes && r.quotes.length > 0 ? (
                            <span className="font-bold text-sm text-[#4F46E5]">{r.quotes.length}</span>
                          ) : (
                            <span className="text-xs text-[#9CA3AF]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-xs text-[#9CA3AF]">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
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
            </Card>
          </div>
        </main>
      </div>
    </div>
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
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-bold text-[#111827] mb-6">Sample Requests</h1>
            <Card className="p-5 mb-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[#111827]">925 Sterling Silver Hoop Earrings</p>
                  <p className="text-sm text-[#6B7280]">Artisan Metals Co. · REQ-001</p>
                </div>
                <StatusBadge status="Shipped" />
              </div>
              <div className="flex items-center gap-0 overflow-x-auto pb-2 mb-4">
                {sampleSteps.map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= 3 ? "bg-[#4F46E5] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{i + 1}</div>
                      <span className="text-[9px] text-[#6B7280] mt-1 text-center max-w-12">{s}</span>
                    </div>
                    {i < sampleSteps.length - 1 && (
                      <div className={`h-0.5 w-6 mx-0.5 mb-4 ${i < 3 ? "bg-[#4F46E5]" : "bg-[#E5E7EB]"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center bg-[#F9FAFB] rounded-lg p-3">
                  <p className="font-bold text-sm text-[#111827]">₹250</p>
                  <p className="text-xs text-[#6B7280]">Sample cost</p>
                </div>
                <div className="text-center bg-[#F9FAFB] rounded-lg p-3">
                  <p className="font-bold text-sm text-[#111827]">₹120</p>
                  <p className="text-xs text-[#6B7280]">Shipping</p>
                </div>
                <div className="text-center bg-[#F9FAFB] rounded-lg p-3">
                  <p className="font-bold text-sm text-[#111827]">Aug 24</p>
                  <p className="text-xs text-[#6B7280]">Expected delivery</p>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">Tracking: DTDC98234 — In transit</p>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" disabled>Approve Sample</Button>
                <Button variant="outline" size="sm" disabled>Reject Sample</Button>
                <Button variant="ghost" size="sm" disabled>Request Changes</Button>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">Actions available after delivery</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl font-bold text-brand-500/20 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-sm text-ink-3 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate(-1)}>Go back</Button>
          <Link to="/"><Button variant="outline">Home</Button></Link>
        </div>
      </div>
    </div>
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
