import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, StarRating, Button, Badge, Card, Input } from "../components/ui";
import api from "../api/client";
import { parseImages, getManufacturerImages } from "../utils/image";

export default function Manufacturers() {
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchManufacturers();
  }, [debouncedSearch, verifiedOnly]);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (verifiedOnly) params.append("verificationStatus", "VERIFIED");
      
      const res = await api.get(`/manufacturers?${params.toString()}`);
      if (res.data.success) {
        setManufacturers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch manufacturers", err);
      setError("Failed to load manufacturers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#111827] mb-2">Find Manufacturers</h1>
          <p className="text-[#6B7280]">Browse verified manufacturers across India</p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Search manufacturers by name or category..."
              icon={<Search size={16} />}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer bg-white border border-border rounded-xl px-4 h-[46px] shadow-sm select-none hover:border-brand-200 transition-all duration-300">
            <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} className="accent-[#4F46E5]" />
            Verified only
          </label>
        </div>

        <p className="text-sm text-[#6B7280] mb-4">
          Showing <span className="font-semibold text-[#111827]">{manufacturers.length}</span> manufacturers
        </p>

        {loading ? (
          <div className="py-16 text-center">Loading...</div>
        ) : error ? (
          <div className="py-16 text-center text-red-600">{error}</div>
        ) : manufacturers.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="font-semibold text-[#111827] mb-1">No manufacturers found</p>
            <p className="text-sm text-[#6B7280]">Try adjusting your filters.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {manufacturers.map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ManufacturerCard({ manufacturer: m }: { manufacturer: any }) {
  const isVerified = m.verificationStatus === 'VERIFIED';
  const name = m.factoryName || m.user?.companyName || m.user?.name || "Manufacturer";
  const images = getManufacturerImages(name);

  return (
    <Card className="hover:border-brand-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Mini Cover Banner */}
      <div className="h-28 w-full overflow-hidden relative bg-muted shrink-0">
        <img src={images.banner} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {isVerified && (
          <span className="absolute top-3 right-3 bg-success-bg/95 backdrop-blur-sm border border-success/30 text-success text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle size={10} className="stroke-[2.5]" /> Verified Mfr
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 flex-1 flex flex-col pt-0 relative">
        {/* Overlapping Logo */}
        <div className="-mt-9 mb-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
            <img src={images.logo} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name & Star */}
        <div className="mb-2 min-w-0">
          <h3 className="font-display font-bold text-[#111827] text-base leading-snug group-hover:text-brand-600 transition-colors truncate">{name}</h3>
          <div className="mt-1">
            <StarRating rating={m.rating || 4.5} reviews={m.reviewCount || 10} />
          </div>
        </div>

        {/* Extra tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="text-[10px] font-semibold bg-brand-50 text-brand-600 border border-brand-100 rounded px-1.5 py-0.5">Jewellery</span>
          <span className="text-[10px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] rounded px-1.5 py-0.5">Low MOQ</span>
          <span className="text-[10px] font-semibold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE] rounded px-1.5 py-0.5">Export Ready</span>
        </div>

        <div className="flex flex-col gap-2 mb-5 mt-auto text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-brand-500" /> <span>{m.city || "India"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-brand-500" /> <span>Responds {'< 24h'}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-[#F3F4F6] shrink-0">
          <Stat label="Min. Order" value={m.minOrderQuantity ? `${m.minOrderQuantity} pcs` : "Varies"} />
          <Stat label="Orders" value={m.reviewCount ? String(m.reviewCount * 7) : "0"} />
          <Stat label="Capacity" value={m.productionCapacity ? m.productionCapacity.split(" ")[0] : "N/A"} />
        </div>

        <Link to={`/manufacturer/${m.id}`} className="block mt-auto">
          <Button variant="outline" size="sm" className="w-full justify-center group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-colors">View Profile</Button>
        </Link>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-[#F9FAFB] rounded-lg py-2 px-1">
      <p className="font-bold text-xs text-[#111827] leading-snug">{value}</p>
      <p className="text-[10px] text-[#6B7280] truncate">{label}</p>
    </div>
  );
}

export function ManufacturerProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("products");
  
  const [m, setM] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManufacturer = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/manufacturers/${id}`);
        if (res.data.success) {
          setM(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch manufacturer profile", err);
        setError("Failed to load manufacturer details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchManufacturer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="py-16 text-center">Loading profile...</div>
      </div>
    );
  }

  if (error || !m) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <Card className="p-8 flex flex-col items-center gap-5 shadow-lg border-red-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-[#111827] mb-2">Profile Not Found</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We couldn't find this manufacturer profile. This can happen if the database was recently reseeded, causing profile IDs to expire.
              </p>
            </div>
            <Link to="/manufacturers" className="w-full">
              <Button variant="primary" className="w-full justify-center">
                Back to Directory
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const isVerified = m.verificationStatus === 'VERIFIED';
  const name = m.factoryName || m.user?.companyName || m.user?.name || "Manufacturer";
  const images = getManufacturerImages(name);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
        {/* Profile Card Header */}
        <Card className="mb-8 overflow-hidden">
          {/* Dynamic Large Factory Banner */}
          <div className="h-60 w-full overflow-hidden relative">
            <img src={images.banner} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Overlapping Info Section */}
          <div className="p-6 relative">
            {/* Floating Logo Container (Absolute Positioned) */}
            <div className="absolute -top-16 left-6 sm:left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white z-20">
              <img src={images.logo} alt={name} className="w-full h-full object-cover" />
            </div>

            {/* Info and Navigation Columns (Padded to clear the logo) */}
            <div className="pt-14 sm:pt-0 sm:pl-36 flex flex-col sm:flex-row sm:items-end justify-between gap-5 relative z-10 text-center sm:text-left">
              <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start mb-1.5">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">{name}</h1>
                  {isVerified && <VerifiedBadge />}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-ink-2">
                  <StarRating rating={m.rating || 4.5} reviews={m.reviewCount || 10} />
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-500" />{m.city || "India"}</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-brand-500" />Responds {'< 24h'}</span>
                </div>
              </div>
              <div className="flex gap-2 sm:self-end sm:pb-2 shrink-0 w-full sm:w-auto justify-center">
                <Link to={`/post-requirement?manufacturer=${m.id}`} className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto justify-center">Send Requirement</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F3F4F6]">
              {[
                { label: "Completed Orders", value: m.reviewCount ? String(m.reviewCount * 7) : "0" },
                { label: "Products Listed", value: m.user?.products?.length || "0" },
                { label: "Min. Order Quantity", value: m.minOrderQuantity ? `${m.minOrderQuantity} pcs` : "Varies" },
                { label: "Monthly Capacity", value: m.productionCapacity || "N/A" },
              ].map((s) => (
                <div key={s.label} className="bg-surface rounded-xl p-3 border border-border/50 text-center">
                  <p className="font-display font-extrabold text-2xl text-[#111827]">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="border-b border-[#E5E7EB] flex gap-0 mb-6 bg-white rounded-t-xl">
              {["products", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-[#4F46E5] text-[#4F46E5]" : "border-transparent text-[#6B7280] hover:text-[#374151]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "products" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {m.user?.products?.length > 0 ? m.user.products.map((p: any) => (
                  <Link to={`/product/${p.id}`} key={p.id}>
                    <Card className="p-4 hover:border-[#4F46E5] transition-colors cursor-pointer">
                      <div className="aspect-video bg-[#F3F4F6] rounded-lg mb-3 overflow-hidden">
                        <img src={parseImages(p.images, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80')} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-semibold text-sm text-[#111827] mb-1 truncate">{p.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">₹{p.price}/{p.unit}</span>
                        <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-1 rounded-md">Min {p.minOrderQuantity}</span>
                      </div>
                    </Card>
                  </Link>
                )) : (
                  <div className="col-span-2 text-center py-10 text-sm text-[#6B7280]">
                    No products listed yet.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-col gap-3 py-10 text-center text-sm text-[#6B7280]">
                No reviews yet. Reviews are only available after verified orders.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Capabilities</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Sample Available", yes: true },
                  { label: "Customization", yes: true },
                  { label: "Custom Packaging", yes: true },
                  { label: "Export Ready", yes: false },
                ].map(({ label, yes }) => (
                  <div key={label} className="flex items-center justify-between text-sm py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-[#374151]">{label}</span>
                    {yes ? (
                      <span className="text-[#059669] font-semibold bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded text-xs flex items-center gap-1">
                        <CheckCircle size={10} /> Yes
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF] font-medium bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded text-xs">
                        No
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-[#EEF2FF] border-[#C7D2FE]">
              <p className="text-xs font-bold text-[#4338CA] uppercase tracking-widest mb-2">Verified Business</p>
              <p className="text-xs text-[#4338CA] mb-3 leading-relaxed">
                {isVerified ? "GST verified · Documents checked · Quality audited" : "Verification pending or not verified."}
              </p>
              {isVerified && <VerifiedBadge />}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
