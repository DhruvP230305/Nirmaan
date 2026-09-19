import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ShoppingBag, Factory, Eye, EyeOff, Check, Sparkles } from "lucide-react";
import { Button, Chassis } from "../components/ui";
import api from "../api/client";
import { useAuth, UserRole } from "../contexts/AuthContext";

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <Chassis className="min-h-[85vh] flex flex-col justify-center">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-5xl mx-auto w-full">
        {/* Left Dark Bento Panel */}
        <div className="lg:w-96 bento-card bg-[#111111] text-white flex flex-col p-8 justify-between shrink-0 shadow-2xl relative overflow-hidden">
          <div
            className="floating-orb w-64 h-64 -top-10 -right-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(217, 255, 54, 0.2) 0%, transparent 70%)" }}
          />
          <Link to="/" className="font-display font-black text-white text-2xl tracking-tight z-10">
            Nirmaan<span className="text-[#2d62ed]">.</span>
          </Link>
          <div className="my-8 z-10">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-widest text-[#d9ff36] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
              Prototype Live
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug">
              Direct-to-Factory Sourcing OS
            </h2>
            <div className="flex flex-col gap-3">
              {[
                "Inspected Indian MSME factories",
                "Minimum batch orders from 50 pcs",
                "Rapid sample prototyping in 3 days",
                "Synchronized business kit packaging",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <Check size={14} className="text-[#d9ff36] shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 font-mono-tech z-10">© 2026 Nirmaan Marketplace Prototype</p>
        </div>

        {/* Right Form Bento Card */}
        <div className="flex-1 bento-card bg-white p-8 md:p-10 flex flex-col justify-center shadow-lg">
          <div className="mb-6">
            <Link to="/" className="lg:hidden font-display font-extrabold text-[#121316] text-xl block mb-4">
              Nirmaan<span className="text-[#2d62ed]">.</span>
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#121316] tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-[#6b7280] font-medium mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </Chassis>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [showPw, setShowPw] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        if (res.data.data.user.role === 'MANUFACTURER') {
          navigate("/mfr/dashboard");
        } else if (res.data.data.user.role === 'ADMIN') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        return;
      }
    } catch (err: any) {
      console.warn("Backend login failed, allowing prototype fallback:", err);
      // If demo email was entered, allow fallback
      if (email.includes("buyer")) {
        demoLogin("BUYER");
        navigate("/dashboard");
        return;
      } else if (email.includes("mfr") || email.includes("factory")) {
        demoLogin("MANUFACTURER");
        navigate("/mfr/dashboard");
        return;
      } else if (email.includes("admin")) {
        demoLogin("ADMIN");
        navigate("/admin");
        return;
      }
      setError("Credentials not recognized. You can click any 1-Click Prototype Demo login below!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole, targetPath: string) => {
    demoLogin(role);
    navigate(targetPath);
  };

  return (
    <AuthShell title="Console Sign In" subtitle="Sign in to your sourcing account or launch prototype instant demo">
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        {error && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-2xl font-medium">{error}</div>}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Email address</label>
          <input 
            type="email" 
            placeholder="buyer@d2c.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/10 bg-white rounded-full text-xs font-medium text-[#121316] placeholder:text-[#9ca3af] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#2d62ed] hover:underline font-bold">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black/10 bg-white rounded-full text-xs font-medium text-[#121316] placeholder:text-[#9ca3af] px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#121316]">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <Button variant="primary" size="md" withArrow type="submit" disabled={loading} className="w-full mt-1 font-extrabold text-xs">
          {loading ? "Signing in..." : "Sign In to Account"}
        </Button>

        {/* 1-Click Prototype Demo Section */}
        <div className="pt-3 border-t border-black/5 flex flex-col gap-2.5">
          <p className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-[#6b7280] text-center">
            ⚡ 1-Click Prototype Demo Access
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("BUYER", "/dashboard")}
              className="px-2.5 py-2 rounded-full bg-[#f4f3ee] hover:bg-[#111111] hover:text-[#d9ff36] text-[11px] font-bold text-[#121316] border border-black/5 transition-all cursor-pointer shadow-sm text-center"
            >
              Buyer Console
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("MANUFACTURER", "/mfr/dashboard")}
              className="px-2.5 py-2 rounded-full bg-[#f4f3ee] hover:bg-[#111111] hover:text-[#d9ff36] text-[11px] font-bold text-[#121316] border border-black/5 transition-all cursor-pointer shadow-sm text-center"
            >
              Factory Console
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("ADMIN", "/admin")}
              className="px-2.5 py-2 rounded-full bg-[#f4f3ee] hover:bg-[#111111] hover:text-[#d9ff36] text-[11px] font-bold text-[#121316] border border-black/5 transition-all cursor-pointer shadow-sm text-center"
            >
              Admin Panel
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#6b7280] mt-1">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#2d62ed] font-bold hover:underline">Create one</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const [role, setRole] = useState<"buyer" | "manufacturer" | null>(null);

  if (role === null) {
    return (
      <AuthShell title="What are you here to do?" subtitle="We'll personalise your experience based on your role.">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setRole("buyer")}
            className="flex items-center gap-4 border-2 border-[#E5E7EB] rounded-xl p-5 text-left hover:border-brand-500 hover:bg-brand-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <ShoppingBag size={22} className="text-brand-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-[#111827]">Start / Grow My Business</p>
              <p className="text-sm text-[#6B7280]">I want to source products and build a brand</p>
            </div>
            <ArrowRight size={16} className="text-[#9CA3AF] ml-auto" />
          </button>

          <button
            onClick={() => setRole("manufacturer")}
            className="flex items-center gap-4 border-2 border-[#E5E7EB] rounded-xl p-5 text-left hover:border-brand-500 hover:bg-brand-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Factory size={22} className="text-brand-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-[#111827]">Manufacture / Supply Products</p>
              <p className="text-sm text-[#6B7280]">I'm a manufacturer or supplier looking for buyers</p>
            </div>
            <ArrowRight size={16} className="text-[#9CA3AF] ml-auto" />
          </button>

          <p className="text-center text-sm text-[#6B7280] mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  if (role === "buyer") {
    return <BuyerOnboarding onBack={() => setRole(null)} />;
  }
  return <ManufacturerOnboarding onBack={() => setRole(null)} />;
}

function BuyerOnboarding({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    businessType: "Just starting out",
    address: "",
    city: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName: formData.companyName,
        role: "BUYER",
        businessType: formData.businessType,
        address: formData.address,
        city: formData.city,
      });

      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set up your buyer account" subtitle={`Step ${step} of ${totalSteps}`}>
      <div className="mb-6">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-brand-500" : "bg-[#E5E7EB]"}`} />
          ))}
        </div>
      </div>
      
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Your name</label>
            <input type="text" placeholder="Jai Duggal" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Business name</label>
            <input type="text" placeholder="My Brand Store" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Business stage</label>
            <select value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>Just starting out</option>
              <option>Growing — placed first orders</option>
              <option>Established brand</option>
            </select>
          </div>
          <Button variant="primary" size="lg" className="w-full mt-1" onClick={() => { if(formData.name && formData.companyName) setStep(2); else setError("Please fill all fields"); }}>
            Continue <ArrowRight size={16} />
          </Button>
          <button onClick={onBack} className="text-sm text-center text-[#6B7280] hover:text-[#374151]">← Go back</button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Address</label>
            <input type="text" placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">City / Location</label>
            <input type="text" placeholder="Mumbai, Maharashtra" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          
          <Button variant="primary" size="lg" className="w-full mt-1" onClick={() => { if(formData.city) { setError(""); setStep(3); } else setError("Please enter your city"); }}>
            Continue <ArrowRight size={16} />
          </Button>
          <button onClick={() => { setError(""); setStep(1); }} className="text-sm text-center text-[#6B7280] hover:text-[#374151]">← Go back</button>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Email address</label>
            <input type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Password</label>
            <input type="password" placeholder="Create a strong password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>

          <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-4 text-sm text-[#065F46] mt-2">
            <p className="font-semibold mb-1">You're almost ready!</p>
            <p>We'll match you with verified manufacturers based on your preferences.</p>
          </div>

          <Button variant="primary" size="lg" className="w-full" disabled={loading} onClick={handleRegister}>
            {loading ? "Registering..." : "Let's find the right suppliers for you"} <ArrowRight size={16} />
          </Button>
          <button onClick={() => { setError(""); setStep(2); }} className="text-sm text-center text-[#6B7280] hover:text-[#374151]">← Go back</button>
        </div>
      )}
    </AuthShell>
  );
}

function ManufacturerOnboarding({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const steps = ["Profile", "Credentials", "Confirmation"];

  const [formData, setFormData] = useState({
    factoryName: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName: formData.factoryName,
        factoryName: formData.factoryName,
        role: "MANUFACTURER",
        phone: formData.phone,
        city: formData.city,
      });

      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        setStep(3); // Go to verification pending screen
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set up your manufacturer profile" subtitle={`Step ${step} of ${totalSteps}`}>
      <div className="mb-6">
        <div className="flex gap-1 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-brand-500" : "bg-[#E5E7EB]"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <span key={s} className={`text-[10px] font-medium flex-1 text-center ${i + 1 === step ? "text-brand-500" : i + 1 < step ? "text-[#059669]" : "text-[#9CA3AF]"}`}>{s}</span>
          ))}
        </div>
      </div>
      
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Business/Factory name</label>
            <input type="text" placeholder="Artisan Metals Co." value={formData.factoryName} onChange={e => setFormData({...formData, factoryName: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Owner / Contact name</label>
            <input type="text" placeholder="Ramesh Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Location / City</label>
            <input type="text" placeholder="Jaipur, Rajasthan" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          
          <Button variant="primary" size="lg" className="w-full mt-1" onClick={() => { if(formData.factoryName && formData.name) setStep(2); else setError("Please fill all fields"); }}>Continue <ArrowRight size={16} /></Button>
          <button onClick={onBack} className="text-sm text-center text-[#6B7280] hover:text-[#374151]">← Go back</button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Email</label>
            <input type="email" placeholder="contact@business.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Phone</label>
            <input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Password</label>
            <input type="password" placeholder="Create a strong password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-brand-500" />
          </div>
          
          <Button variant="primary" size="lg" className="w-full" disabled={loading} onClick={handleRegister}>
            {loading ? "Registering..." : "Submit Registration"} <ArrowRight size={16} />
          </Button>
          <button onClick={() => { setError(""); setStep(1); }} className="text-sm text-center text-[#6B7280] hover:text-[#374151]">← Go back</button>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 text-sm text-[#92400E]">
            <p className="font-semibold mb-1">Registration Successful</p>
            <p>Your manufacturer account is created and pending admin verification.</p>
          </div>
          <div className="flex flex-col gap-3">
            {["Business information", "Contact information", "Account created", "Pending verification"].map((item, i) => (
              <div key={item} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i < 3 ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                  {i < 3 ? <Check size={11} /> : "○"}
                </div>
                <span className="text-sm text-[#374151]">{item}</span>
              </div>
            ))}
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={() => navigate("/mfr/dashboard")}>
            Continue to Dashboard <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
