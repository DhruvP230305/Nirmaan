import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Grid3x3, List, MapPin, ChevronDown, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, MoqBadge, StarRating, Button, Input, Chassis } from "../components/ui";
import api from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { parseImages } from "../utils/image";
import { products as mockProducts } from "../data/mock";

const FILTERS = {
  categories: ["Earrings", "Necklaces", "Bracelets", "Rings", "Accessories", "Packaging"],
  moq: ["Any", "50", "100", "200", "500"],
  locations: ["Any", "Jaipur", "Mumbai", "Delhi", "Surat", "Chennai"],
};

export default function Discover() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Relevance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [sampleOnly, setSampleOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCats, verified, sampleOnly, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCats.length > 0) params.append("categories", selectedCats.join(","));
      if (verified) params.append("verified", "true");
      if (sort) params.append("sort", sort);

      const selectedMoq = (document.querySelector('input[name="moq"]:checked') as HTMLInputElement)?.value;
      if (selectedMoq && selectedMoq !== "Any") {
        params.append("moq", selectedMoq);
      }

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success && res.data.data?.products?.length > 0) {
        setProducts(res.data.data.products);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("API request failed or backend unavailable, using rich mock catalog data", err);
    }

    // High quality mock fallback
    let filtered = [...mockProducts];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (selectedCats.length > 0) {
      filtered = filtered.filter((p) => {
        const catName = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
        return selectedCats.some((cat) => catName.toLowerCase() === cat.toLowerCase());
      });
    }
    if (verified) {
      filtered = filtered.filter(
        (p) =>
          p.manufacturer?.verified ||
          p.manufacturer?.manufacturerProfile?.verificationStatus === "VERIFIED"
      );
    }
    setProducts(filtered);
    setLoading(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <Chassis>
      <Navbar />

      {/* Header & Pill Category Bar (Section 7G) */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#2d62ed]">
              Direct Factory Catalogue
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#121316] tracking-tight mt-1">
              Discover Products & Custom Tooling
            </h1>
            <p className="text-sm text-[#6b7280] font-medium mt-1">
              Browse low-MOQ products directly from inspected manufacturers with verified material specs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full px-4 py-2 border border-black/5 shadow-sm flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-[#121316] font-bold focus:outline-none cursor-pointer"
              >
                <option value="Relevance">Relevance</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Highest Rated">Highest Rated</option>
              </select>
            </div>

            <div className="flex bg-white border border-black/5 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  view === "grid" ? "bg-[#111111] text-white shadow-sm" : "text-[#6b7280] hover:text-[#121316]"
                }`}
              >
                <Grid3x3 size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  view === "list" ? "bg-[#111111] text-white shadow-sm" : "text-[#6b7280] hover:text-[#121316]"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCats([])}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCats.length === 0
                ? "bg-[#111111] text-white shadow-sm"
                : "bg-white text-[#6b7280] hover:text-[#121316] border border-black/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9ff36]" />
            All Products
          </button>
          {FILTERS.categories.map((cat) => {
            const active = selectedCats.includes(cat);
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCats((prev) =>
                    prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
                  )
                }
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#111111] text-white shadow-sm"
                    : "bg-white text-[#6b7280] hover:text-[#121316] border border-black/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input Pill */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Search products, metal grade, MOQ, or suppliers..."
              icon={<Search size={16} />}
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 h-[46px] border border-black/10 bg-white rounded-full text-xs font-bold text-[#121316] shadow-sm cursor-pointer"
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* Main Grid + Filter Sidebar Layout */}
        <div className="flex gap-6 items-start">
          {/* Sidebar Filters */}
          <aside
            className={`${
              sidebarOpen ? "block" : "hidden"
            } lg:block w-64 shrink-0 bg-white rounded-[28px] p-5 border border-black/5 shadow-[var(--shadow-card)] sticky top-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-extrabold text-sm text-[#121316]">Filter By</h3>
              <button
                className="text-xs text-[#2d62ed] font-bold hover:underline cursor-pointer"
                onClick={() => {
                  setSelectedCats([]);
                  setVerified(false);
                  setSampleOnly(false);
                  setSearch("");
                }}
              >
                Reset
              </button>
            </div>

            <FilterSection title="Category">
              <div className="flex flex-col gap-2.5">
                {FILTERS.categories.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2.5 text-xs font-semibold text-[#6b7280] hover:text-[#121316] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c)}
                      onChange={() =>
                        setSelectedCats((prev) =>
                          prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                        )
                      }
                      className="rounded text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Minimum Order">
              <div className="flex flex-col gap-2.5">
                {FILTERS.moq.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2.5 text-xs font-semibold text-[#6b7280] hover:text-[#121316] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="moq"
                      value={m}
                      defaultChecked={m === "Any"}
                      onChange={fetchProducts}
                      className="text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <span>{m === "Any" ? "Any MOQ" : `Under ${m} pcs`}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Verification Status">
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-[#6b7280] hover:text-[#121316] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="rounded text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Verified Factories Only</span>
                </label>
              </div>
            </FilterSection>
          </aside>

          {/* Product Cards Bento Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className={
                  view === "grid"
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bento-card bg-white p-5 animate-pulse h-[340px] flex flex-col justify-between"
                  >
                    <div className="h-44 bg-[#f4f3ee] rounded-2xl w-full" />
                    <div className="space-y-2 mt-4">
                      <div className="h-4 bg-[#f4f3ee] rounded w-3/4" />
                      <div className="h-4 bg-[#f4f3ee] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bento-card p-16 text-center bg-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#f9f8f5] rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#6b7280]" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#121316] mb-1">
                  No Products Found
                </h3>
                <p className="text-xs text-[#6b7280] max-w-sm mb-6">
                  Try widening your category filters or search parameters.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCats([]);
                    setVerified(false);
                    setSearch("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={
                  view === "grid"
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Chassis>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-black/5 pt-4 mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 outline-none group cursor-pointer"
      >
        <span className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-[#121316]">
          {title}
        </span>
        <ChevronDown
          size={13}
          className={`text-[#6b7280] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, view }: { product: any; view: "grid" | "list" }) {
  const navigate = useNavigate();
  const isVerified =
    product.manufacturer?.verified ||
    product.manufacturer?.manufacturerProfile?.verificationStatus === "VERIFIED";
  const location =
    product.manufacturer?.manufacturerProfile?.city ||
    product.location ||
    product.manufacturer?.location ||
    "Jaipur, India";
  const rating =
    product.rating || product.manufacturer?.manufacturerProfile?.rating || 4.8;
  const title = product.title || product.name || "Custom Manufactured Product";
  const moq = product.minOrderQuantity || product.moq || 50;
  const unit = product.unit || "pcs";
  const category =
    (typeof product.category === "object" ? product.category?.name : product.category) ||
    "Jewelry";

  // Resolve Image cleanly
  let image = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500";
  if (product.image) {
    image = product.image;
  } else if (product.images) {
    image = parseImages(product.images, image);
  }

  if (view === "list") {
    return (
      <div
        className="bento-card p-5 bg-white flex flex-col sm:flex-row gap-5 hover:border-black/10 transition-all cursor-pointer group"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="w-full sm:w-44 h-40 rounded-2xl bg-[#f9f8f5] overflow-hidden shrink-0 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#121316] group-hover:text-[#2d62ed] transition-colors">
                  {title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {isVerified && <VerifiedBadge />}
                  <StarRating rating={rating} />
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono-tech font-extrabold text-xl text-[#121316]">
                  ₹{product.price}
                  <span className="text-xs font-normal text-[#6b7280]">/{unit}</span>
                </p>
                <div className="mt-1">
                  <MoqBadge moq={moq} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <MapPin size={13} />
              <span>{location}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                View
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post-requirement?product=${product.id}`);
                }}
              >
                + Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bento-card p-4 bg-white flex flex-col justify-between hover:border-black/10 transition-all cursor-pointer group h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div>
        {/* Card Top: Badges */}
        <div className="flex items-center justify-between mb-3">
          <MoqBadge moq={moq} />
          {isVerified ? (
            <VerifiedBadge />
          ) : (
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-[#6b7280] bg-[#f4f3ee] px-2.5 py-0.5 rounded-full">
              Standard
            </span>
          )}
        </div>

        {/* Image Stage */}
        <div className="h-48 rounded-2xl bg-[#f9f8f5] overflow-hidden relative mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#121316] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            👁️ Quick View
          </div>
        </div>

        {/* Colorway Swatches Row (Section 7E) */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-3 h-3 rounded-full bg-[#121316] ring-1 ring-offset-1 ring-black" />
          <span className="w-3 h-3 rounded-full bg-[#94a3b8]" />
          <span className="w-3 h-3 rounded-full bg-[#d4af37]" />
        </div>

        <p className="text-[11px] font-mono-tech uppercase tracking-wider text-[#6b7280] mb-1">
          {category}
        </p>

        <h3 className="font-display font-extrabold text-base text-[#121316] group-hover:text-[#2d62ed] transition-colors line-clamp-1 mb-1.5">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating} />
          <span className="text-xs text-[#6b7280] flex items-center gap-1">
            <MapPin size={11} /> {location.split(",")[0]}
          </span>
        </div>
      </div>

      {/* Card Footer: Price & Primary Action */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
        <div>
          <p className="font-mono-tech font-extrabold text-lg text-[#121316] leading-none">
            ₹{product.price}
          </p>
          <span className="text-[10px] font-medium text-[#6b7280]">per {unit}</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="text-xs px-4"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post-requirement?product=${product.id}`);
          }}
        >
          + Quote
        </Button>
      </div>
    </div>
  );
}
