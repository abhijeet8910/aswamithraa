import React, { useState, useEffect } from "react";
import { Loader2, LogOut, MapPin, Save, Leaf, Landmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";

const FarmerSettings = () => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    farmLocation: "",
    farmerCategory: "smallholder" as "smallholder" | "bulk",
    upiId: "",
    bankAccountNumber: "",
    ifscCode: "",
  });
  const [location, setLocation] = useState({
    village: "",
    panchayat: "",
    mandal: "",
    district: "",
    state: "",
  });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          farmLocation: data.farmLocation || "",
          farmerCategory: data.farmerCategory || "smallholder",
          upiId: data.upiId || "",
          bankAccountNumber: data.bankAccountNumber || "",
          ifscCode: data.ifscCode || "",
        });
        setLocation({
          village: data.locationHierarchy?.village || "",
          panchayat: data.locationHierarchy?.panchayat || "",
          mandal: data.locationHierarchy?.mandal || "",
          district: data.locationHierarchy?.district || "",
          state: data.locationHierarchy?.state || "",
        });
        setAddress({
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          pincode: data.address?.pincode || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await userService.updateProfile({
        ...profile,
        locationHierarchy: location,
        address,
      });
      setMessage("Profile updated successfully!");
      await updateUser();
    } catch (err: any) {
      setMessage(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const inputClass = "mt-1 w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none text-sm";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Farm Settings</h1>
        <p className="text-green-100 text-sm">Manage your farm profile and payment details</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-lg">Personal Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Full Name</label>
              <input name="name" placeholder="Name" value={profile.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <input name="phone" placeholder="Phone" value={profile.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input name="email" value={profile.email} readOnly className={`${inputClass} bg-gray-50 text-gray-500`} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Farm Location</label>
              <input name="farmLocation" placeholder="e.g., Warangal, Telangana" value={profile.farmLocation} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Farmer Category</label>
              <select name="farmerCategory" value={profile.farmerCategory} onChange={handleChange} className={inputClass}>
                <option value="smallholder">🌱 Smallholder (UPI)</option>
                <option value="bulk">🚜 Bulk (Bank Transfer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Hierarchy */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-lg">Location Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">Village</label><input name="village" placeholder="Village" value={location.village} onChange={handleLocationChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Panchayat</label><input name="panchayat" placeholder="Panchayat" value={location.panchayat} onChange={handleLocationChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Mandal</label><input name="mandal" placeholder="Mandal" value={location.mandal} onChange={handleLocationChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">District</label><input name="district" placeholder="District" value={location.district} onChange={handleLocationChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">State</label><input name="state" placeholder="State" value={location.state} onChange={handleLocationChange} className={inputClass} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500">Street / Full Address</label><input name="street" placeholder="Full address" value={address.street} onChange={handleAddressChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">City</label><input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Pincode</label><input name="pincode" placeholder="PIN Code" value={address.pincode} onChange={handleAddressChange} maxLength={6} className={inputClass} /></div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-lg">Payment Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">UPI ID</label><input name="upiId" placeholder="name@upi" value={profile.upiId} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Bank Account Number</label><input name="bankAccountNumber" placeholder="Account number" value={profile.bankAccountNumber} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">IFSC Code</label><input name="ifscCode" placeholder="SBIN0001234" value={profile.ifscCode} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        {/* Save */}
        <div className="bg-white shadow-sm border rounded-xl p-6 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Verification Status</h2>
            <p className="text-sm text-gray-500">
              Status:{" "}
              <span className={`ml-2 px-3 py-1 text-xs rounded-full ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {user?.isVerified ? "Verified" : "Pending"}
              </span>
            </p>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 font-medium">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
};

export default FarmerSettings;