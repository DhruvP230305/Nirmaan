import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Clock, ChevronRight, MessageSquare, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, MoqBadge, StarRating, Button, Chassis } from "../components/ui";
import api from "../api/client";
import { products as mockProducts } from "../data/mock";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.data) {
          setProduct(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Product API lookup failed, checking local catalog", err);
      }

      const found = mockProducts.find((p) => String(p.id) === String(id));
      if (found) {
        setProduct(found);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <Chassis>
        <Navbar />
        <div className="bento-card p-16 text-center bg-white">
          <p className="text-xs font-mono-tech text-[#6b7280]">Loading product specifications...</p>
        </div>
      </Chassis>
    );
  }

  if (error || !product) {
    return (
      <Chassis>
        <Navbar />
        <div className="bento-card p-16 text-center bg-white">
          <p className="text-sm font-bold text-[#ef4444] mb-4">{error || "Product not found"}</p>
          <Link to="/discover">
            <Button variant="outline" size="sm">Browse Catalog</Button>
          </Link>
        </div>
      </Chassis>
    );
  }

  let imgs = [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600"
  ];
  if (product.image) {
    imgs = [product.image];
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    imgs = product.images;
  } else if (typeof product.images === 'string' && product.images.length > 0) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) imgs = parsed;
    } catch {
      imgs = [product.images];
    }
  }
  
  const manufacturer = product.manufacturer;
  const isVerified = manufacturer?.manufacturerProfile?.verificationStatus === 'VERIFIED';
  const location = manufacturer?.manufacturerProfile?.city || 'Jaipur, India';
  const rating = manufacturer?.manufacturerProfile?.rating || 4.8;
  
  const specs = [
    { label: "Material Grade", value: "925 Sterling / Brass Core" },
    { label: "Unit Packaging", value: product.unit },
    { label: "Monthly Capacity", value: manufacturer?.manufacturerProfile?.productionCapacity || "50,000 units" },
    { label: "Sampling Lead Time", value: "3-5 Business Days" },
    { label: "Bulk Lead Time", value: "14-21 Business Days" },
  ];

  return (
    <Chassis>
      <Navbar />

      {/* Breadcrumb Pill Strip */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 w-fit">
        <Link to="/discover" className="hover:text-[#121316]">Catalogue</Link>
        <ChevronRight size={12} className="text-black/30" />
        <span className="text-[#6b7280]">{product.category?.name || 'Jewelry'}</span>
        <ChevronRight size={12} className="text-black/30" />
        <span className="text-[#121316] font-bold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left: Images Stage & Details Bento */}
        <div className="flex flex-col gap-6">
          <div className="bento-card p-6 bg-white">
            <div className="grid md:grid-cols-[90px_1fr] gap-4 mb-6">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3">
                {imgs.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImg === i ? "border-[#121316] shadow-sm scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-[#f9f8f5] relative border border-black/5">
                <img src={imgs[selectedImg]} alt={product.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <MoqBadge moq={product.minOrderQuantity} />
                </div>
              </div>
            </div>

            {/* Pill Tabs (Section 7G) */}
            <div className="flex items-center gap-2 border-b border-black/5 pb-3 mb-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#111111] text-white shadow-sm"
                      : "text-[#6b7280] hover:text-[#121316] hover:bg-[#f4f3ee]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap font-medium">
                {product.description || "Crafted to high D2C retail specifications. Includes precise metal alloy composition, anti-tarnish coating, and standardized dimensional checks prior to shipment."}
              </p>
            )}

            {activeTab === "specifications" && (
              <div className="border border-black/5 rounded-2xl overflow-hidden">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`grid grid-cols-2 px-5 py-3.5 text-xs ${
                      i % 2 === 0 ? "bg-[#f9f8f5]" : "bg-white"
                    }`}
                  >
                    <span className="font-bold text-[#121316]">{spec.label}</span>
                    <span className="font-mono-tech text-[#6b7280]">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="p-8 text-center text-xs text-[#6b7280] bg-[#f9f8f5] rounded-2xl">
                Verified buyer reviews are unlocked upon physical delivery and batch QA confirmation.
              </div>
            )}
          </div>
        </div>

        {/* Right: Pricing & Order Action Bento */}
        <div className="flex flex-col gap-6">
          <div className="bento-card p-6 bg-white flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="font-display font-extrabold text-2xl text-[#121316] leading-snug">
                  {product.title}
                </h1>
                {isVerified && <VerifiedBadge />}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={rating} reviews={18} />
                <span className="text-xs text-[#6b7280]">· Verified Supplier</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline justify-between p-4 bg-[#f9f8f5] rounded-2xl border border-black/5">
                <div>
                  <span className="text-xs text-[#6b7280] block">Estimated Factory Unit Price</span>
                  <p className="font-mono-tech font-extrabold text-3xl text-[#121316]">
                    ₹{product.price}
                  </p>
                  <span className="text-[11px] text-[#9ca3af]">per {product.unit} (ex. GST)</span>
                </div>
                <div className="text-right">
                  <MoqBadge moq={product.minOrderQuantity} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-[#6b7280] pt-2 border-t border-black/5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Clock size={13} /> Production Lead Time</span>
                <span className="font-mono-tech font-bold text-[#121316]">7–14 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><MapPin size={13} /> Factory Hub</span>
                <span className="font-bold text-[#121316]">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle size={13} className="text-[#10b981]" /> Paid Physical Sample</span>
                <span className="font-mono-tech font-bold text-[#10b981]">Available</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link to={`/post-requirement?product=${product.id}`}>
                <Button variant="primary" size="lg" withArrow className="w-full text-xs font-extrabold">
                  Request Custom Quote
                </Button>
              </Link>
              <Link to={`/samples/request/${product.id}`}>
                <Button variant="outline" size="md" className="w-full text-xs font-bold">
                  Order Prototype Sample
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="ghost" size="sm" className="w-full text-xs font-semibold text-[#6b7280]">
                  <MessageSquare size={14} className="mr-1.5" /> Message Factory Representative
                </Button>
              </Link>
            </div>
          </div>

          {/* Manufacturer Profile Mini Bento */}
          <div className="bento-card p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-display font-black text-sm">
                {manufacturer?.companyName?.[0] || manufacturer?.name?.[0] || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-sm text-[#121316] truncate">
                  {manufacturer?.companyName || manufacturer?.name || "Artisan Manufacturing"}
                </p>
                <p className="text-[11px] font-mono-tech text-[#6b7280]">{location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center bg-[#f9f8f5] rounded-xl p-2.5 border border-black/5">
                <p className="font-mono-tech font-bold text-xs text-[#121316]">&lt; 2h</p>
                <p className="text-[10px] text-[#6b7280]">Response</p>
              </div>
              <div className="text-center bg-[#f9f8f5] rounded-xl p-2.5 border border-black/5">
                <p className="font-mono-tech font-bold text-xs text-[#2d62ed]">99.2%</p>
                <p className="text-[10px] text-[#6b7280]">On-Time</p>
              </div>
              <div className="text-center bg-[#f9f8f5] rounded-xl p-2.5 border border-black/5">
                <p className="font-mono-tech font-bold text-xs text-[#10b981]">Audited</p>
                <p className="text-[10px] text-[#6b7280]">ISO 9001</p>
              </div>
            </div>

            <Link to={`/manufacturer/${manufacturer?.id}`}>
              <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                View Full Factory Profile ↗
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Chassis>
  );
}
