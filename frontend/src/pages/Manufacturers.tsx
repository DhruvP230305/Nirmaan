import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, StarRating, Button, Card, Input, Chassis } from "../components/ui";
import api from "../api/client";
import { parseImages, getManufacturerImages } from "../utils/image";
import { manufacturers as mockManufacturers } from "../data/mock";

export default function Manufacturers() {
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
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
      if (res.data.success && res.data.data?.length > 0) {
        setManufacturers(res.data.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Manufacturers API unavailable, using prototype directory data", err);
    }

    let filtered = [...mockManufacturers];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(m => m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q));
    }
    if (verifiedOnly) {
      filtered = filtered.filter(m => m.verified);
    }
    setManufacturers(filtered);
    setLoading(false);
  };

  return (
    <Chassis>
      <Navbar />
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
            Inspected Partner Network
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#121316] tracking-tight mt-1">
            Verified Indian Manufacturers
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] font-medium mt-1">
            Connect directly with audited factory owners. Zero broker commission, low MOQs, and escrow milestone protection.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-64">
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Search manufacturers by name, cluster, or material..."
              icon={<Search size={16} />}
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-[#121316] cursor-pointer bg-white border border-black/10 rounded-full px-4 py-3 shadow-sm select-none hover:border-black/30 transition-all">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={() => setVerifiedOnly(!verifiedOnly)}
              className="accent-black rounded cursor-pointer"
            />
            Verified Only
          </label>
        </div>

        <p className="text-xs font-mono-tech font-semibold text-[#6b7280]">
          Displaying <span className="font-bold text-[#121316]">{manufacturers.length}</span> manufacturing facilities
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bento-card p-6 bg-white animate-pulse h-64" />
            ))}
          </div>
        ) : manufacturers.length === 0 ? (
          <div className="bento-card py-16 text-center bg-white">
            <p className="font-display font-bold text-lg text-[#121316] mb-1">No manufacturers found</p>
            <p className="text-xs text-[#6b7280]">Try clearing your search query.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
          </div>
        )}
      </div>
    </Chassis>
  );
}

export function ManufacturerCard({ manufacturer: m }: { manufacturer: any }) {
  const isVerified = m.verified || m.verificationStatus === 'VERIFIED';
  const name = m.factoryName || m.name || m.user?.companyName || m.user?.name || "Manufacturer";
  const city = m.city || m.location || "Jaipur, Rajasthan";
  const rating = m.rating || 4.8;
  const reviewCount = m.reviews || m.reviewCount || 120;
  const images = getManufacturerImages(name);

  return (
    <div className="bento-card p-0 bg-white flex flex-col h-full overflow-hidden group hover:border-black/15 transition-all">
      {/* Mini Cover Banner */}
      <div className="h-32 w-full overflow-hidden relative bg-[#f9f8f5] shrink-0">
        <img
          src={images.banner}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {isVerified && (
          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#059669] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="live-bullet" /> Verified Mfr
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col pt-0 relative">
        {/* Overlapping Logo */}
        <div className="-mt-8 mb-3 relative z-10 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
            <img src={images.logo} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#f9f8f5] px-2.5 py-1 rounded-full border border-black/5">
            <StarRating rating={rating} reviews={reviewCount} />
          </div>
        </div>

        <h3 className="font-display font-extrabold text-lg text-[#121316] group-hover:text-[#2d62ed] transition-colors line-clamp-1 mb-1">
          {name}
        </h3>

        <p className="text-xs text-[#6b7280] flex items-center gap-1.5 mb-3">
          <MapPin size={13} /> {city}
        </p>

        <p className="text-xs text-[#6b7280] line-clamp-2 mb-4 font-medium">
          {m.about || "Premier manufacturing facility specializing in custom alloy casting, anti-tarnish polishing, and private label execution."}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono-tech">
          <div className="bg-[#f9f8f5] p-2 rounded-xl text-center border border-black/5">
            <p className="text-[10px] text-[#6b7280] uppercase">Capacity</p>
            <p className="font-bold text-[#121316]">{m.productionCapacity || "25K pcs/mo"}</p>
          </div>
          <div className="bg-[#f9f8f5] p-2 rounded-xl text-center border border-black/5">
            <p className="text-[10px] text-[#6b7280] uppercase">Min Order</p>
            <p className="font-bold text-[#2d62ed]">{m.moqRange || "50–200 pcs"}</p>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between">
          <span className="text-[11px] font-mono-tech text-[#10b981] font-bold">
            ⚡ Resp: &lt; 4 hrs
          </span>
          <Link to={`/manufacturer/${m.id}`}>
            <Button variant="primary" size="sm" className="text-xs px-4">
              View Profile ↗
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ManufacturerProfile() {
  const { id } = useParams();
  const [m, setM] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManufacturer = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/manufacturers/${id}`);
        if (res.data.success && res.data.data) {
          setM(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Manufacturer profile API unavailable, checking prototype catalog", err);
      }

      const found = mockManufacturers.find(item => String(item.id) === String(id));
      if (found) {
        setM({
          ...found,
          factoryName: found.name,
          verificationStatus: found.verified ? 'VERIFIED' : 'STANDARD',
          city: found.location,
          country: 'India',
          productionCapacity: '25,000 pcs/month',
          minOrderQuantity: 50,
          reviewCount: found.reviews,
        });
      } else {
        setError("Manufacturer profile not found.");
      }
      setLoading(false);
    };
    if (id) fetchManufacturer();
  }, [id]);

  if (loading) {
    return (
      <Chassis>
        <Navbar />
        <div className="bento-card p-16 text-center bg-white">
          <p className="text-xs font-mono-tech text-[#6b7280]">Loading verified manufacturer credentials...</p>
        </div>
      </Chassis>
    );
  }

  if (error || !m) {
    return (
      <Chassis>
        <Navbar />
        <div className="bento-card p-12 text-center max-w-md mx-auto bg-white">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display font-bold text-xl text-[#121316] mb-2">Profile Not Found</h2>
          <p className="text-xs text-[#6b7280] mb-6">
            The manufacturer profile could not be loaded. Please return to the directory.
          </p>
          <Link to="/manufacturers">
            <Button variant="primary" size="sm" className="w-full">
              Back to Directory
            </Button>
          </Link>
        </div>
      </Chassis>
    );
  }

  const isVerified = m.verificationStatus === 'VERIFIED' || m.verified;
  const name = m.factoryName || m.name || m.user?.companyName || m.user?.name || "Manufacturer";
  const city = m.city || m.location || "Jaipur, India";
  const images = getManufacturerImages(name);

  return (
    <Chassis>
      <Navbar />

      <div className="flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="bento-card p-0 bg-white overflow-hidden">
          <div className="h-64 w-full overflow-hidden relative">
            <img src={images.banner} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="p-6 relative">
            <div className="-mt-16 mb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img src={images.logo} alt={name} className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-2.5">
                <Link to={`/post-requirement?mfr=${m.id}`}>
                  <Button variant="primary" size="md" withArrow className="text-xs font-extrabold">
                    Send RFQ to Factory
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant="outline" size="md" className="text-xs font-bold">
                    Message
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#121316]">
                {name}
              </h1>
              {isVerified && <VerifiedBadge />}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b7280] font-medium mb-6">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {city}</span>
              <span>•</span>
              <StarRating rating={m.rating || 4.8} reviews={m.reviewCount || 120} />
              <span>•</span>
              <span className="font-mono-tech text-[#10b981] font-bold">⚡ Avg response &lt; 4 hours</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-black/5">
              <div className="bg-[#f9f8f5] p-3.5 rounded-2xl border border-black/5 text-center">
                <p className="text-[10px] font-mono-tech uppercase text-[#6b7280]">Capacity</p>
                <p className="font-display font-extrabold text-base text-[#121316]">{m.productionCapacity || "25,000 pcs/mo"}</p>
              </div>
              <div className="bg-[#f9f8f5] p-3.5 rounded-2xl border border-black/5 text-center">
                <p className="text-[10px] font-mono-tech uppercase text-[#6b7280]">Min Order</p>
                <p className="font-display font-extrabold text-base text-[#2d62ed]">{m.minOrderQuantity || 50} pcs</p>
              </div>
              <div className="bg-[#f9f8f5] p-3.5 rounded-2xl border border-black/5 text-center">
                <p className="text-[10px] font-mono-tech uppercase text-[#6b7280]">Sampling</p>
                <p className="font-display font-extrabold text-base text-[#121316]">3–5 days</p>
              </div>
              <div className="bg-[#f9f8f5] p-3.5 rounded-2xl border border-black/5 text-center">
                <p className="text-[10px] font-mono-tech uppercase text-[#6b7280]">Compliance</p>
                <p className="font-display font-extrabold text-base text-[#10b981]">ISO 9001</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Bento */}
        <div className="bento-card p-6 bg-white">
          <h2 className="font-display font-extrabold text-lg text-[#121316] mb-2">
            Factory Overview & Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed font-medium">
            {m.about || "Established manufacturing unit operating precision CNC milling, laser cutting, casting, micro-setting, and electro-deposition lines. Equipped to handle prototype development to multi-thousand piece batch orders with certified assay hallmarking."}
          </p>
        </div>
      </div>
    </Chassis>
  );
}
