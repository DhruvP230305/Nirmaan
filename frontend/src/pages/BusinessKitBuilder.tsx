import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Package, Palette, Image as ImageIcon, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button } from "../components/ui";

export default function BusinessKitBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setHasGenerated(false);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2500);
  };

  // Mock generated assets
  const colors = [
    { name: "Primary", hex: "#0F172A" },
    { name: "Secondary", hex: "#D97706" },
    { name: "Accent", hex: "#F59E0B" },
    { name: "Background", hex: "#FAFAFA" },
  ];

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-ink">Business Kit Builder</h1>
              <p className="text-sm text-ink-3 mt-1">Generate a brand identity, color palette, and packaging design from a single prompt.</p>
            </div>

            <Card className="p-6 mb-8 border-brand-500 shadow-sm relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <label className="block text-sm font-bold text-ink mb-2">Describe your brand vision</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A premium sustainable matcha brand targeting young professionals, minimalist vibe with earthy green tones..."
                    className="flex-1 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <Button 
                    variant="primary" 
                    className="py-3 px-6 h-auto"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Sparkles size={16} />
                        </motion.div>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles size={16} /> Generate Kit
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <AnimatePresence>
              {hasGenerated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Brand Palette */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="p-6 h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <Palette size={20} className="text-brand-500" />
                          <h2 className="font-bold text-ink text-lg">Color Palette</h2>
                        </div>
                        <p className="text-sm text-ink-3 mb-6">Generated based on your description.</p>
                        
                        <div className="flex h-32 rounded-xl overflow-hidden mb-4">
                          {colors.map((c, i) => (
                            <div key={i} className="flex-1 flex items-end justify-center pb-2 transition-all hover:flex-[1.5]" style={{ backgroundColor: c.hex }}>
                              <span className={`text-xs font-mono font-bold ${c.name === 'Background' ? 'text-ink' : 'text-white'}`}>{c.hex}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-ink-3">
                          {colors.map(c => <div key={c.name}>{c.name}</div>)}
                        </div>
                      </Card>
                    </motion.div>

                    {/* Logo Concept */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <ImageIcon size={20} className="text-brand-500" />
                          <h2 className="font-bold text-ink text-lg">Logo Concept</h2>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-xl border border-dashed border-border relative group">
                          {/* Placeholder for generated image */}
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent rounded-xl"></div>
                          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-display font-bold text-brand-500 z-10 mb-2">
                            {prompt.charAt(15).toUpperCase() || 'M'}
                          </div>
                          <span className="text-sm font-semibold text-ink z-10 tracking-widest uppercase">Your Brand</span>
                          
                          <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                            <Button variant="primary" size="sm"><Download size={14} className="mr-1"/> Download Assets</Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Packaging Ideas */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Package size={20} className="text-brand-500" />
                        <h2 className="font-bold text-ink text-lg">Packaging Concepts</h2>
                      </div>
                      <p className="text-sm text-ink-3 mb-6">AI-generated packaging concepts matching your brand.</p>
                      
                      <div className="grid sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="group relative rounded-xl overflow-hidden border border-border aspect-[4/3] bg-muted flex items-center justify-center">
                            <Package size={40} className="text-ink-3/30 group-hover:scale-110 transition-transform" />
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-white text-xs font-semibold">Concept {i}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  <div className="flex justify-end gap-3 mt-8">
                    <Button variant="outline">Discard</Button>
                    <Link to="/post-requirement">
                      <Button variant="primary">
                        Use for new requirement <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
