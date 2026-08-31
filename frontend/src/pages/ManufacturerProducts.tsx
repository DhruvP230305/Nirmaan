import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Package, X, Image as ImageIcon } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, Badge } from "../components/ui";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { parseImages } from "../utils/image";

export default function ManufacturerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [unit, setUnit] = useState("piece");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        // Filter products to only show current manufacturer's products
        // In a real app, you might have a specific route like GET /mfr/products
        // or the backend filters it by default. For now, we filter on frontend just in case.
        const myProducts = res.data.data.products.filter((p: any) => p.manufacturerId === user?.id);
        setProducts(myProducts);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setMinOrderQuantity("");
    setUnit("piece");
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price.toString());
    setMinOrderQuantity(p.minOrderQuantity.toString());
    setUnit(p.unit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
  };

  const handleSave = async () => {
    if (!title || !price || !minOrderQuantity) return;
    
    setSaving(true);
    const payload = {
      title,
      description,
      price: parseFloat(price),
      minOrderQuantity: parseInt(minOrderQuantity),
      unit
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts(); // refresh
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="manufacturer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="manufacturer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">My Products</h1>
                <p className="text-sm text-ink-3 mt-1">Manage your catalogue visible to buyers.</p>
              </div>
              <Button variant="primary" onClick={openAddModal}>
                <Plus size={16} /> Add Product
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted rounded-xl h-64"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="py-20 text-center border-dashed">
                  <Package size={48} className="text-brand-500/50 mx-auto mb-4" />
                  <p className="font-display text-lg font-bold text-ink mb-2">No products added yet</p>
                  <p className="text-sm text-ink-3 mb-6 max-w-sm mx-auto">Build your catalogue to show buyers what you can manufacture.</p>
                  <Button variant="primary" onClick={openAddModal}>Add Your First Product</Button>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="p-0 overflow-hidden group hover:border-brand-500/50 transition-colors h-full flex flex-col relative">
                        <div className="h-40 bg-muted flex items-center justify-center relative">
                          {p.images && parseImages(p.images, '') ? (
                            <img src={parseImages(p.images, '')} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="text-ink-3/30" />
                          )}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(p)} className="p-2 bg-white rounded-lg shadow hover:text-brand-500 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-white rounded-lg shadow hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-ink mb-1 line-clamp-1">{p.title}</h3>
                          <p className="text-xs text-ink-3 mb-4 line-clamp-2 flex-1">{p.description}</p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-lg text-ink">₹{p.price}</span>
                              <span className="text-xs text-ink-3">/{p.unit}</span>
                            </div>
                            <Badge variant="muted">MOQ: {p.minOrderQuantity}</Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
                <h2 className="font-display font-bold text-lg text-ink">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-ink-3 hover:text-ink">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Product Title *</label>
                  <input 
                    type="text" 
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. Premium Cotton T-Shirt"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Description</label>
                  <textarea 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                    placeholder="Describe materials, sizing, etc."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-2">Price (₹) *</label>
                    <input 
                      type="number" 
                      value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-2">Unit</label>
                    <input 
                      type="text" 
                      value={unit} onChange={(e) => setUnit(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="piece, kg, set"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Minimum Order Quantity (MOQ) *</label>
                  <input 
                    type="number" 
                    value={minOrderQuantity} onChange={(e) => setMinOrderQuantity(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-border bg-surface flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={saving || !title || !price || !minOrderQuantity}>
                  {saving ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
