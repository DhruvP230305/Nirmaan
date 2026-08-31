import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Clock, ChevronRight, MessageSquare, Star, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, MoqBadge, StarRating, Button, Card } from "../components/ui";
import api from "../api/client";

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
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="py-16 text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="py-16 text-center text-red-600">{error || "Product not found"}</div>
      </div>
    );
  }

  let imgs = ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500'];
  if (Array.isArray(product.images) && product.images.length > 0) {
    imgs = product.images;
  } else if (typeof product.images === 'string' && product.images.length > 0) {
    try {
      const parsed = JSON.parse(product.images);
      imgs = Array.isArray(parsed) && parsed.length > 0 ? parsed : [product.images];
    } catch(e) {
      imgs = [product.images];
    }
  }
  
  const manufacturer = product.manufacturer;
  const isVerified = manufacturer?.manufacturerProfile?.verificationStatus === 'VERIFIED';
  const location = manufacturer?.manufacturerProfile?.city || 'India';
  const rating = manufacturer?.manufacturerProfile?.rating || 0;
  
  // Fake specs for now since they are not in the schema
  const specs = [
    { label: "Material", value: "Standard" },
    { label: "Unit", value: product.unit },
    { label: "Production Capacity", value: manufacturer?.manufacturerProfile?.productionCapacity || "N/A" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-[#6B7280]">
          <Link to="/discover" className="hover:text-[#4F46E5]">Products</Link>
          <ChevronRight size={12} />
          <span className="text-[#4B5563]">{product.category?.name || 'Uncategorized'}</span>
          <ChevronRight size={12} />
          <span className="text-[#111827] font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div>
            <div className="grid md:grid-cols-[80px_1fr] gap-4 mb-8">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3">
                {imgs.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImg === i ? "border-[#4F46E5]" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3F4F6]">
                <img src={imgs[selectedImg]} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E5E7EB] flex gap-0 mb-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-[#4F46E5] text-[#4F46E5]" : "border-transparent text-[#6B7280] hover:text-[#374151]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{product.description}</p>
            )}
            {activeTab === "specifications" && (
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                {specs.map((spec, i) => (
                  <div key={spec.label} className={`grid grid-cols-2 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"}`}>
                    <span className="font-medium text-[#374151]">{spec.label}</span>
                    <span className="text-[#6B7280]">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4 text-sm text-[#6B7280] text-center py-10">
                No reviews yet. Reviews are only available after verified orders.
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h1 className="font-display font-bold text-xl text-[#111827] leading-snug pr-4">{product.title}</h1>
                {isVerified && <VerifiedBadge />}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={rating} reviews={0} />
              </div>

              <div className="flex items-end justify-between pb-4 border-b border-[#F3F4F6] mb-4">
                <div>
                  <p className="text-3xl font-bold text-[#111827]">₹{product.price}</p>
                  <p className="text-xs text-[#6B7280]">per {product.unit} (ex. taxes)</p>
                </div>
                <MoqBadge moq={product.minOrderQuantity} />
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <InfoRow icon={<Clock size={14} />} label="Production time" value="7-14 days" />
                <InfoRow icon={<MapPin size={14} />} label="Location" value={location} />
                <InfoRow
                  icon={<CheckCircle size={14} className="text-[#059669]" />}
                  label="Sample available"
                  value="Yes — request below" // Assuming sample available for now
                />
                <InfoRow
                  icon={<CheckCircle size={14} className="text-[#4F46E5]" />}
                  label="Customization"
                  value="Available"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Link to={`/post-requirement?product=${product.id}`}><Button variant="primary" size="lg" className="w-full">Request Quote</Button></Link>
                <Link to={`/samples/request/${product.id}`}><Button variant="outline" size="lg" className="w-full">Request Sample</Button></Link>
                <Link to="/messages"><Button variant="ghost" size="md" className="w-full text-[#6B7280]">
                  <MessageSquare size={15} /> Contact Manufacturer
                </Button></Link>
              </div>
            </Card>

            {/* Manufacturer card */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center font-bold text-[#9CA3AF]">
                  {manufacturer?.companyName?.[0] || manufacturer?.name?.[0] || 'M'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#111827] truncate">{manufacturer?.companyName || manufacturer?.name}</p>
                    {isVerified && <VerifiedBadge />}
                  </div>
                  <StarRating rating={rating} reviews={0} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <Stat label="Response" value="< 24h" />
                <Stat label="Orders" value="0" />
                <Stat label="Verified" value={isVerified ? "Yes" : "No"} />
              </div>
              <Link to={`/manufacturer/${manufacturer?.id}`}>
                <Button variant="outline" size="sm" className="w-full">View Profile</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <span className="text-[#9CA3AF]">{icon}</span>
        {label}
      </div>
      <span className="text-xs font-semibold text-[#374151]">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-[#F9FAFB] rounded-lg py-2">
      <p className="font-bold text-sm text-[#111827]">{value}</p>
      <p className="text-[10px] text-[#6B7280]">{label}</p>
    </div>
  );
}
