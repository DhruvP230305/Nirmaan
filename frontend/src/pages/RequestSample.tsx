import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button, Card, Input } from "../components/ui";
import api from "../api/client";

export default function RequestSample() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const requestSample = async () => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      await api.post('/samples', {
        manufacturerId: product.manufacturerId,
        productId: product.id,
        quantity,
        price: product.price * quantity,
        notes
      });
      alert("Sample requested successfully!");
      navigate('/messages'); // Take them to messages where they can talk to manufacturer
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error requesting sample');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center mt-20">
          <div className="animate-pulse text-ink-3">Loading product details...</div>
        </main>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center mt-20">
          <p className="mb-4">Product not found.</p>
          <Button variant="outline" onClick={() => navigate('/discover')}>Back to Discover</Button>
        </main>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-ink">Request a Sample</h1>
              <p className="text-sm text-ink-3 mt-1">Review the sample details before sending your request.</p>
            </div>
            
            <Card className="p-6 border-border shadow-sm">
              <div className="flex items-center gap-5 mb-8 pb-5 border-b border-border">
                <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <Package size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-ink line-clamp-1">{product.title}</h2>
                  <p className="text-sm text-ink-3 mt-0.5">{product.manufacturer.companyName || product.manufacturer.name}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ink-2 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface"
                  />
                  <p className="text-xs text-ink-3 mt-1">Samples are typically 1-3 units.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-ink-2 mb-2">Requirements / Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., I would like to see the polished finish variant..." 
                    className="w-full min-h-32 border border-border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-surface resize-y" 
                  />
                </div>
                
                <div className="bg-muted p-4 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-ink-2">Sample Price (estimated)</span>
                  <span className="font-display text-xl font-bold text-ink">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <Button variant="primary" onClick={requestSample} disabled={isSubmitting} className="py-3 px-6">
                  {isSubmitting ? "Requesting..." : "Send Request"} <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
