import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ShoppingBag, Factory, Eye, EyeOff, Check } from "lucide-react";
import { Button, Input } from "../components/ui";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-96 bg-[#111827] flex-col p-10 justify-between shrink-0">
        <Link to="/" className="font-display font-bold text-white text-xl">
          Nirmaan<span className="text-brand-500">.</span>
        </Link>
        <div>
          <p className="font-display text-3xl font-bold text-white mb-6 leading-tight">
            The complete sourcing platform for D2C brands.
          </p>
          <div className="flex flex-col gap-3">
            {["Verified manufacturers", "Low minimum orders from 50 pcs", "Sample before you bulk order", "Packaging & branding kits"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                <Check size={14} className="text-brand-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#4B5563]">© 2026 Nirmaan</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="lg:hidden font-display font-bold text-[#111827] text-xl block mb-6">
              Nirmaan<span className="text-brand-500">.</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">{title}</h1>
            {subtitle && <p className="text-sm text-[#6B7280]">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account to continue">
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#374151]">Email address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#374151]">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-500 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E5E7EB] bg-white rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button variant="primary" size="lg" type="submit" disabled={loading} className="w-full mt-1">
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-xs text-[#9CA3AF]">or</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        <button type="button" disabled className="w-full border border-[#E5E7EB] bg-white rounded-lg py-2.5 text-sm font-medium text-[#9CA3AF] cursor-not-allowed flex items-center justify-center gap-3 transition-colors opacity-60">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google — Coming soon
        </button>

        <p className="text-center text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-500 font-semibold hover:underline">Create one</Link>
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
