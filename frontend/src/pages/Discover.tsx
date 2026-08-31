import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, ChevronDown, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { VerifiedBadge, MoqBadge, StarRating, Button, Card, Input } from "../components/ui";
import api from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { parseImages } from "../utils/image";

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
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      if (res.data.success) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-16">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-ink mb-2">Discover Products</h1>
          <p className="text-ink-3 font-medium">Browse high-quality products from our verified manufacturing partners.</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-4 mb-8 items-end">
          <div className="flex-1">
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Search products, materials, or categories..."
              icon={<Search size={18} />}
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 h-[46px] border border-border bg-white rounded-xl text-sm font-bold text-ink-2 hover:bg-surface shadow-sm active:scale-95 transition-all"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 shrink-0`}>
            <Card className="p-5 sticky top-28 bg-white/50 backdrop-blur-md border-border/60 shadow-lg shadow-ink/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-ink text-base">Filters</h3>
                <button className="text-xs text-brand-600 font-bold hover:text-brand-700 transition-colors" onClick={() => { setSelectedCats([]); setVerified(false); setSampleOnly(false); setSearch(""); }}>
                  Clear all
                </button>
              </div>

              <FilterSection title="Category">
                <div className="flex flex-col gap-3">
                  {FILTERS.categories.map((c) => (
                    <label key={c} className="flex items-center gap-3 text-sm font-medium text-ink-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(c)}
                          onChange={() => setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                          className="peer appearance-none w-5 h-5 border-2 border-border rounded flex-shrink-0 checked:bg-brand-500 checked:border-brand-500 transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="group-hover:text-ink transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Minimum Order">
                <div className="flex flex-col gap-3">
                  {FILTERS.moq.map((m) => (
                    <label key={m} className="flex items-center gap-3 text-sm font-medium text-ink-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="moq" 
                          value={m} 
                          className="peer appearance-none w-5 h-5 border-2 border-border rounded-full flex-shrink-0 checked:border-brand-500 transition-colors cursor-pointer" 
                          onChange={() => fetchProducts()} 
                        />
                        <div className="absolute w-2.5 h-2.5 bg-brand-500 rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                      </div>
                      <span className="group-hover:text-ink transition-colors">{m === "Any" ? "Any quantity" : `From ${m} pcs`}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Verification">
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 text-sm font-medium text-ink-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={verified} onChange={() => setVerified(!verified)} className="peer appearance-none w-5 h-5 border-2 border-border rounded flex-shrink-0 checked:bg-brand-500 checked:border-brand-500 transition-colors cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="group-hover:text-ink transition-colors flex items-center gap-2">Verified Only <VerifiedBadge /></span>
                  </label>
                </div>
              </FilterSection>
            </Card>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 bg-white p-2 pl-4 rounded-xl border border-border shadow-sm">
              <p className="text-sm font-semibold text-ink-3">
                <span className="font-bold text-ink">{products.length}</span> products match
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none border border-border bg-surface hover:bg-muted rounded-lg pl-4 pr-10 py-2.5 text-sm font-bold text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  >
                    {["Relevance", "Price: Low to High", "Price: High to Low", "MOQ: Low to High", "Rating"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
                </div>
                <div className="flex border border-border rounded-lg overflow-hidden bg-surface p-1">
                  <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-white shadow-sm text-brand-600" : "text-ink-3 hover:text-ink"}`}>
                    <Grid3x3 size={18} />
                  </button>
                  <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-white shadow-sm text-brand-600" : "text-ink-3 hover:text-ink"}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={view === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className={`animate-pulse overflow-hidden ${view === "list" ? "flex gap-4 p-4" : "h-[380px]"}`}>
                    <div className={`${view === "list" ? "w-32 h-32 rounded-xl" : "h-48 w-full"} bg-muted`}></div>
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-muted rounded w-1/3"></div>
                      <div className="mt-auto flex gap-2">
                        <div className="h-10 bg-muted rounded flex-1"></div>
                        <div className="h-10 bg-muted rounded flex-1"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-12 text-center border-danger-bg bg-danger-bg/30">
                  <p className="font-bold text-danger mb-2">{error}</p>
                  <Button variant="outline" onClick={fetchProducts}>Try Again</Button>
                </Card>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="p-16 text-center border-dashed border-2 flex flex-col items-center justify-center bg-surface/50">
                  <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-border flex items-center justify-center mb-6">
                    <Search size={32} className="text-ink-3" />
                  </div>
                  <p className="font-display font-bold text-2xl text-ink mb-2">No products found</p>
                  <p className="text-ink-3 max-w-sm mb-6 font-medium">We couldn't find any products matching your current filters and search terms.</p>
                  <Button variant="outline" onClick={() => { setSelectedCats([]); setVerified(false); setSearch(""); }}>Clear Filters</Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className={view === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}>
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-border pt-5 mt-5">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-4 group outline-none">
        <span className="text-xs font-extrabold text-ink uppercase tracking-wider">{title}</span>
        <div className="w-6 h-6 rounded-md group-hover:bg-surface flex items-center justify-center transition-colors">
          <ChevronDown size={14} className={`text-ink-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
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
  const isVerified = product.manufacturer?.manufacturerProfile?.verificationStatus === 'VERIFIED';
  const location = product.manufacturer?.manufacturerProfile?.city || 'India';
  const rating = product.manufacturer?.manufacturerProfile?.rating || 0;
  const image = parseImages(product.images, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500');

  if (view === "list") {
    return (
      <Card className="flex gap-5 p-5 hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="w-40 h-40 rounded-xl bg-surface overflow-hidden shrink-0 relative">
          <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-display font-bold text-lg text-ink mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-1">{product.title}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                {isVerified && <VerifiedBadge />}
                <StarRating rating={rating} reviews={product.manufacturer?.manufacturerProfile?.reviewCount || 0} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display font-bold text-xl text-ink">₹{product.price}<span className="text-xs font-semibold text-ink-3">/{product.unit}</span></p>
              <div className="mt-1"><MoqBadge moq={product.minOrderQuantity} /></div>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg border border-border">
              <MapPin size={14} className="text-ink-3" />
              <span className="text-xs font-bold text-ink-2">{location}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="w-24">View</Button>
              <Button variant="primary" size="sm" className="w-24 shadow-sm" onClick={(event) => { event.preventDefault(); event.stopPropagation(); navigate(`/post-requirement?product=${product.id}`); }}>Quote</Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:border-brand-300 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="aspect-[4/3] bg-surface overflow-hidden relative">
        <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isVerified && (
          <div className="absolute top-3 left-3">
            <VerifiedBadge />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col bg-white">
        <div className="mb-4">
          <h3 className="font-display font-bold text-lg text-ink leading-tight line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">{product.title}</h3>
          <StarRating rating={rating} reviews={product.manufacturer?.manufacturerProfile?.reviewCount || 0} />
        </div>

        <div className="flex items-end justify-between mb-5 mt-auto bg-surface/50 p-3 rounded-xl border border-border/50">
          <div>
            <p className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-xl font-display font-extrabold text-ink leading-none">₹{product.price}<span className="text-xs font-semibold text-ink-3">/{product.unit}</span></p>
          </div>
          <div className="text-right">
            <MoqBadge moq={product.minOrderQuantity} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-5 text-ink-3">
          <MapPin size={14} />
          <span className="text-xs font-bold text-ink-2">{location}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button variant="outline" size="sm" className="w-full font-bold">View</Button>
          <Button variant="primary" size="sm" className="w-full shadow-sm font-bold" onClick={(event) => { event.preventDefault(); event.stopPropagation(); navigate(`/post-requirement?product=${product.id}`); }}>Quote</Button>
        </div>
      </div>
    </Card>
  );
}
