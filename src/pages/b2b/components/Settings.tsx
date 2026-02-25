import React, { useState, useEffect } from "react";
import { Loader2, LogOut, Save, Building2, CreditCard, Landmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    gstin: "",
    pan: "",
    contactPerson: "",
    upiId: "",
    bankAccountNumber: "",
    ifscCode: "",
  });
  const [officeAddress, setOfficeAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [warehouseAddress, setWarehouseAddress] = useState({
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
          businessName: data.businessName || "",
          gstin: data.gstin || "",
          pan: data.pan || "",
          contactPerson: data.contactPerson || "",
          upiId: data.upiId || "",
          bankAccountNumber: data.bankAccountNumber || "",
          ifscCode: data.ifscCode || "",
        });
        setOfficeAddress({
          street: data.officeAddress?.street || "",
          city: data.officeAddress?.city || "",
          state: data.officeAddress?.state || "",
          pincode: data.officeAddress?.pincode || "",
        });
        setWarehouseAddress({
          street: data.warehouseAddress?.street || "",
          city: data.warehouseAddress?.city || "",
          state: data.warehouseAddress?.state || "",
          pincode: data.warehouseAddress?.pincode || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await userService.updateProfile({
        ...profile,
        officeAddress,
        warehouseAddress,
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

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const inputClass = "mt-1 w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <p className="text-blue-100 text-sm">Manage your company profile and payment details</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Info */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Business Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">Contact Name</label><input name="name" value={profile.name} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Phone</label><input name="phone" value={profile.phone} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Email</label><input name="email" value={profile.email} readOnly className={`${inputClass} bg-gray-50 text-gray-500`} /></div>
            <div><label className="text-xs font-medium text-gray-500">Business Name</label><input name="businessName" value={profile.businessName} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">GSTIN</label><input name="gstin" value={profile.gstin} onChange={handleChange} placeholder="36AABCT1234Z1AZ" className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">PAN</label><input name="pan" value={profile.pan} onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Contact Person</label><input name="contactPerson" value={profile.contactPerson} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        {/* Office Address */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Office Address</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500">Street</label><input value={officeAddress.street} onChange={(e) => setOfficeAddress({ ...officeAddress, street: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">City</label><input value={officeAddress.city} onChange={(e) => setOfficeAddress({ ...officeAddress, city: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">State</label><input value={officeAddress.state} onChange={(e) => setOfficeAddress({ ...officeAddress, state: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Pincode</label><input value={officeAddress.pincode} onChange={(e) => setOfficeAddress({ ...officeAddress, pincode: e.target.value })} maxLength={6} className={inputClass} /></div>
          </div>
        </div>

        {/* Warehouse Address */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Warehouse Address</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500">Street</label><input value={warehouseAddress.street} onChange={(e) => setWarehouseAddress({ ...warehouseAddress, street: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">City</label><input value={warehouseAddress.city} onChange={(e) => setWarehouseAddress({ ...warehouseAddress, city: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">State</label><input value={warehouseAddress.state} onChange={(e) => setWarehouseAddress({ ...warehouseAddress, state: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Pincode</label><input value={warehouseAddress.pincode} onChange={(e) => setWarehouseAddress({ ...warehouseAddress, pincode: e.target.value })} maxLength={6} className={inputClass} /></div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Payment Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">UPI ID</label><input name="upiId" value={profile.upiId} onChange={handleChange} placeholder="business@upi" className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">Bank Account</label><input name="bankAccountNumber" value={profile.bankAccountNumber} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-gray-500">IFSC Code</label><input name="ifscCode" value={profile.ifscCode} onChange={handleChange} placeholder="SBIN0001234" className={inputClass} /></div>
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
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 font-medium">
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

export default Settings;