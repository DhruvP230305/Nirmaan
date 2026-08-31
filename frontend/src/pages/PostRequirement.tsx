import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button, Input, Card } from "../components/ui";
import api from "../api/client";

const STEPS = [
  { id: 1, label: "Product" },
  { id: 2, label: "Quantity & Budget" },
  { id: 3, label: "Manufacturing" },
  { id: 4, label: "Packaging" },
  { id: 5, label: "Review" },
];

export default function PostRequirement() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "Earrings",
    productName: "",
    description: "",
    quantity: "",
    targetPrice: "",
    moqPref: "50-100",
    budgetRange: "",
    customization: false,
    sampleRequired: true,
    deadline: "",
    locationPref: "Anywhere in India",
    needPackaging: false,
    needBranding: false,
    needCustomPackaging: false,
  });
  const [referenceFile, setReferenceFile] = useState("");
  const [error, setError] = useState("");

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  
  const publish = async () => {
    if (!form.productName.trim() || !form.quantity.trim() || !form.description.trim()) {
      setError("Add a product name, description, and quantity before publishing.");
      setStep(1);
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const payload = {
        title: form.productName,
        description: `${form.description}\n\nAdditional Details:\n- Customization: ${form.customization ? 'Yes' : 'No'}\n- Sample Required: ${form.sampleRequired ? 'Yes' : 'No'}\n- Deadline: ${form.deadline || 'Flexible'}\n- Packaging Required: ${form.needPackaging ? 'Yes' : 'No'}`,
        quantity: Number(form.quantity),
        targetPrice: form.targetPrice ? Number(form.targetPrice) : undefined,
      };

      const res = await api.post('/rfqs', payload);
      
      if (res.data.success) {
        navigate("/requirements");
      }
    } catch (err: any) {
      console.error("Failed to post RFQ", err);
      setError(err.response?.data?.message || "Failed to post requirement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">Post a Requirement</h1>
              <p className="text-sm text-[#6B7280]">Tell us what you need and get matched with verified manufacturers.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center shrink-0">
                  <div className={`flex flex-col items-center`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > s.id ? "bg-[#059669] text-white" : step === s.id ? "bg-[#4F46E5] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {step > s.id ? <Check size={14} /> : s.id}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${step === s.id ? "text-[#4F46E5]" : step > s.id ? "text-[#059669]" : "text-[#9CA3AF]"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 sm:w-16 mx-1 mb-4 transition-colors ${step > s.id ? "bg-[#059669]" : "bg-[#E5E7EB]"}`} />
                  )}
                </div>
              ))}
            </div>

            <Card className="p-6">
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-lg text-[#111827]">Product details</h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Product category</label>
                    <select
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                    >
                      {["Earrings", "Necklaces", "Bracelets", "Rings", "Accessories", "Custom"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input label="Product name *" placeholder="e.g. Custom Logo Hoop Earrings" value={form.productName} onChange={(v) => update("productName", v)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Product description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Describe your product — material, size, finish, any customizations needed... (min 10 chars)"
                      rows={4}
                      className="border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
                    />
                  </div>
                    <label className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#4F46E5] hover:bg-[#FAFAFE] transition-colors cursor-pointer block">
                    <Upload size={20} className="text-[#9CA3AF] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#374151] mb-1">{referenceFile || "Upload reference images"}</p>
                    <p className="text-xs text-[#9CA3AF]">PNG, JPG up to 10MB each</p>
                    <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setReferenceFile(event.target.files?.[0]?.name ?? "")} />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-lg text-[#111827]">Quantity & budget</h2>
                  <Input label="Quantity needed *" type="number" placeholder="e.g. 200" value={form.quantity} onChange={(v) => update("quantity", v)} />
                  <Input label="Target price per piece (₹)" type="number" placeholder="e.g. 90" value={form.targetPrice} onChange={(v) => update("targetPrice", v)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Minimum order preference</label>
                    <select value={form.moqPref} onChange={(e) => update("moqPref", e.target.value)} className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]">
                      {["50-100", "100-200", "200-500", "500+"].map((o) => <option key={o}>{o} pieces</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-lg text-[#111827]">Manufacturing requirements</h2>
                  {[
                    { label: "Customization required", sublabel: "Logo, colour, material, or design changes", key: "customization" },
                    { label: "Sample required before bulk order", sublabel: "We'll match you with manufacturers who offer samples", key: "sampleRequired" },
                  ].map(({ label, sublabel, key }) => (
                    <label key={key} className="flex items-start gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#4F46E5] transition-colors">
                      <input
                        type="checkbox"
                        checked={form[key as keyof typeof form] as boolean}
                        onChange={() => update(key, !form[key as keyof typeof form])}
                        className="accent-[#4F46E5] mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{label}</p>
                        <p className="text-xs text-[#6B7280]">{sublabel}</p>
                      </div>
                    </label>
                  ))}
                  <Input label="Production deadline" placeholder="e.g. Sep 15, 2026" value={form.deadline} onChange={(v) => update("deadline", v)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Manufacturer location preference</label>
                    <select className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]">
                      {["Anywhere in India", "Jaipur", "Mumbai", "Delhi", "Surat", "Chennai"].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-lg text-[#111827]">Packaging & branding</h2>
                  <p className="text-sm text-[#6B7280]">Do you need packaging sourced along with your product? We can match you with packaging suppliers too.</p>
                  {[
                    { label: "I need packaging for my products", sublabel: "Boxes, pouches, shipping bags", key: "needPackaging" },
                    { label: "I need branding materials", sublabel: "Stickers, thank-you cards, logo printing", key: "needBranding" },
                    { label: "I need custom packaging", sublabel: "Custom printed boxes with my brand design", key: "needCustomPackaging" },
                  ].map(({ label, sublabel, key }) => (
                    <label key={key} className="flex items-start gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#4F46E5] transition-colors">
                      <input
                        type="checkbox"
                        checked={form[key as keyof typeof form] as boolean}
                        onChange={() => update(key, !form[key as keyof typeof form])}
                        className="accent-[#4F46E5] mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{label}</p>
                        <p className="text-xs text-[#6B7280]">{sublabel}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-lg text-[#111827]">Review & publish</h2>
                  <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3">
                    <ReviewRow label="Category" value={form.category} />
                    <ReviewRow label="Product" value={form.productName || "N/A"} />
                    <ReviewRow label="Quantity" value={form.quantity || "N/A"} />
                    <ReviewRow label="Target Price" value={form.targetPrice ? `₹${form.targetPrice}/pc` : "To be discussed"} />
                    <ReviewRow label="Sample Required" value={form.sampleRequired ? "Yes" : "No"} />
                    <ReviewRow label="Customization" value={form.customization ? "Required" : "Not required"} />
                    <ReviewRow label="Deadline" value={form.deadline || "Flexible"} />
                    <ReviewRow label="Packaging" value={form.needPackaging ? "Required" : "Not required"} />
                  </div>

                  <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-4">
                    <p className="text-sm font-semibold text-[#4338CA] mb-1">What happens next?</p>
                    <p className="text-sm text-[#4338CA]">
                      Your requirement will be published and matched with suitable verified manufacturers. You'll receive quotes within 24–48 hours.
                    </p>
                  </div>
                </div>
              )}

              {error && <p className="mt-5 text-sm text-[#DC2626]">{error}</p>}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
                <Button variant="ghost" size="md" onClick={() => step > 1 ? setStep(s => s - 1) : undefined} disabled={step === 1 || loading}>
                  <ArrowLeft size={15} /> Back
                </Button>
                {step < 5 ? (
                  <Button variant="primary" onClick={() => setStep((s) => s + 1)} disabled={loading}>
                    Continue <ArrowRight size={15} />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={publish} disabled={loading}>
                    {loading ? "Publishing..." : <>Post Requirement <ArrowRight size={15} /></>}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-semibold text-[#111827] text-right">{value}</span>
    </div>
  );
}
