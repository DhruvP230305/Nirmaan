import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Package } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { VerifiedBadge, MoqBadge, Button, Badge, Card, SectionHeader } from "../components/ui";
import { packagingProducts } from "../data/mock";

const KIT_ITEMS = [
  { name: "Sterling Silver Earrings × 200", price: 17600, added: true },
];

const pkgCategories = ["All", "Jewellery Boxes", "Pouches", "Stickers", "Thank You Cards", "Shipping Bags", "Custom"];

export default function Packaging() {
  const [kit, setKit] = useState<typeof packagingProducts>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = packagingProducts.filter((p) => activeCategory === "All" || p.category === activeCategory);
  const kitTotal = 17600 + kit.reduce((sum, p) => sum + p.price * 200, 0);

  const toggleKit = (p: typeof packagingProducts[0]) => {
    setKit((k) => k.find((i) => i.id === p.id) ? k.filter((i) => i.id !== p.id) : [...k, p]);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">Packaging Marketplace</h1>
              <p className="text-sm text-[#6B7280]">Source boxes, pouches, branding materials, and more. Build your complete business kit.</p>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              <div>
                {/* Category tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {pkgCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === c ? "bg-[#4F46E5] text-white" : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((p) => {
                    const inKit = kit.some((k) => k.id === p.id);
                    return (
                      <Card key={p.id} className={`overflow-hidden hover:border-[#4F46E5] transition-colors ${inKit ? "border-[#4F46E5]" : ""}`}>
                        <div className="aspect-video bg-[#F3F4F6] overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-sm text-[#111827]">{p.name}</h3>
                            {p.verified && <VerifiedBadge />}
                          </div>
                          <p className="text-xs text-[#6B7280] mb-2">{p.supplier}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[#111827]">₹{p.price}<span className="text-xs font-normal text-[#6B7280]">/pc</span></span>
                            <MoqBadge moq={p.moq} />
                          </div>
                          {p.customization && <div className="mb-3"><Badge variant="brand">Customizable</Badge></div>}
                          <Button
                            variant={inKit ? "secondary" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => toggleKit(p)}
                          >
                            {inKit ? (
                              <><Minus size={13} /> Remove from kit</>
                            ) : (
                              <><Plus size={13} /> Add to Kit</>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Business Kit Summary */}
              <div>
                <Card className="p-5 sticky top-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={18} className="text-[#4F46E5]" />
                    <h2 className="font-display font-bold text-[#111827]">Business Kit</h2>
                  </div>

                  <div className="flex flex-col gap-3 mb-5">
                    {/* Product already in kit */}
                    <div className="flex items-start justify-between gap-2 text-sm">
                      <div>
                        <p className="font-medium text-[#111827]">Sterling Silver Earrings × 200</p>
                        <p className="text-xs text-[#6B7280]">Artisan Metals Co.</p>
                      </div>
                      <span className="font-bold text-[#111827] shrink-0">₹17,600</span>
                    </div>

                    {kit.map((p) => (
                      <div key={p.id} className="flex items-start justify-between gap-2 text-sm border-t border-[#F3F4F6] pt-3">
                        <div>
                          <p className="font-medium text-[#111827]">{p.name} × 200</p>
                          <p className="text-xs text-[#6B7280]">{p.supplier}</p>
                        </div>
                        <span className="font-bold text-[#111827] shrink-0">₹{(p.price * 200).toLocaleString()}</span>
                      </div>
                    ))}

                    {kit.length === 0 && (
                      <div className="text-center py-6 border-t border-[#F3F4F6] mt-2">
                        <p className="text-xs text-[#9CA3AF]">Add packaging items from the left to build your kit.</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#374151]">Estimated Total</span>
                      <span className="font-display font-bold text-xl text-[#111827]">₹{kitTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1">Ex. taxes and shipping</p>
                  </div>

                  <Link to="/business-kit" className="block">
                    <Button variant="primary" className="w-full" disabled={kit.length === 0}>
                      Build My Kit
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-[#9CA3AF] mt-2">Add packaging items to proceed</p>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
