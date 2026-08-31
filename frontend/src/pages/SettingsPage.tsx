import { useState, useEffect } from "react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, Input } from "../components/ui";
import { Settings, Save, Loader2, User } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    // Buyer
    businessType: "",
    address: "",
    city: "",
    country: "",
    // Manufacturer
    factoryName: "",
    factoryAddress: "",
    productionCapacity: "",
    minOrderQuantity: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        if (res.data.success) {
          const profile = res.data.data;
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            companyName: profile.companyName || "",
            businessType: profile.buyerProfile?.businessType || "",
            address: profile.buyerProfile?.address || "",
            city: profile.buyerProfile?.city || profile.manufacturerProfile?.city || "",
            country: profile.buyerProfile?.country || profile.manufacturerProfile?.country || "",
            factoryName: profile.manufacturerProfile?.factoryName || "",
            factoryAddress: profile.manufacturerProfile?.factoryAddress || "",
            productionCapacity: profile.manufacturerProfile?.productionCapacity || "",
            minOrderQuantity: profile.manufacturerProfile?.minOrderQuantity?.toString() || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");
      
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        companyName: formData.companyName,
        city: formData.city,
        country: formData.country,
      };

      if (user?.role === 'BUYER') {
        payload.businessType = formData.businessType;
        payload.address = formData.address;
      } else if (user?.role === 'MANUFACTURER') {
        payload.factoryName = formData.factoryName;
        payload.factoryAddress = formData.factoryAddress;
        payload.productionCapacity = formData.productionCapacity;
        payload.minOrderQuantity = parseInt(formData.minOrderQuantity) || 1;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType={user?.role?.toLowerCase() || 'buyer'} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type={user?.role?.toLowerCase() || 'buyer'} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
              <p className="text-sm text-ink-3 mt-1">Manage your profile, business information, and preferences.</p>
            </div>
            
            <div className="grid md:grid-cols-[220px_1fr] gap-6">
              <Card className="p-2 h-fit border-border shadow-sm">
                {["Profile", "Business information", "Security", "Notifications"].map((item, index) => (
                  <button 
                    key={item} 
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      index === 0 ? "bg-brand-500/10 text-brand-500 font-semibold" : "text-ink-3 hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </Card>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <User size={18} className="text-brand-500" />
                    <h2 className="font-display text-xl font-bold text-ink">Profile Details</h2>
                  </div>

                  {loading ? (
                    <div className="flex flex-col gap-4">
                      <div className="h-10 bg-muted animate-pulse rounded-lg"></div>
                      <div className="h-10 bg-muted animate-pulse rounded-lg"></div>
                      <div className="h-10 bg-muted animate-pulse rounded-lg"></div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                          {successMsg}
                        </div>
                      )}
                      {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                          {errorMsg}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input 
                          label="Full Name" 
                          name="name"
                          value={formData.name} 
                          onChange={handleChange}
                          required
                        />
                        <Input 
                          label="Email Address" 
                          name="email"
                          value={formData.email} 
                          disabled
                          className="bg-muted text-ink-3 cursor-not-allowed"
                        />
                        <Input 
                          label="Phone Number" 
                          name="phone"
                          value={formData.phone} 
                          onChange={handleChange}
                        />
                        <Input 
                          label="Company Name" 
                          name="companyName"
                          value={formData.companyName} 
                          onChange={handleChange}
                        />
                        <Input 
                          label="City" 
                          name="city"
                          value={formData.city} 
                          onChange={handleChange}
                        />
                        <Input 
                          label="Country" 
                          name="country"
                          value={formData.country} 
                          onChange={handleChange}
                        />

                        {user?.role === 'BUYER' && (
                          <>
                            <Input 
                              label="Business Type" 
                              name="businessType"
                              value={formData.businessType} 
                              onChange={handleChange}
                              placeholder="e.g. D2C Brand"
                            />
                            <Input 
                              label="Address" 
                              name="address"
                              value={formData.address} 
                              onChange={handleChange}
                            />
                          </>
                        )}

                        {user?.role === 'MANUFACTURER' && (
                          <>
                            <Input 
                              label="Factory Name" 
                              name="factoryName"
                              value={formData.factoryName} 
                              onChange={handleChange}
                            />
                            <Input 
                              label="Factory Address" 
                              name="factoryAddress"
                              value={formData.factoryAddress} 
                              onChange={handleChange}
                            />
                            <Input 
                              label="Production Capacity" 
                              name="productionCapacity"
                              value={formData.productionCapacity} 
                              onChange={handleChange}
                              placeholder="e.g. 50,000 units/month"
                            />
                            <Input 
                              label="Default MOQ" 
                              name="minOrderQuantity"
                              type="number"
                              value={formData.minOrderQuantity} 
                              onChange={handleChange}
                            />
                          </>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button variant="primary" type="submit" disabled={saving}>
                          {saving ? (
                            <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</>
                          ) : (
                            <><Save size={16} className="mr-2" /> Save Changes</>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
