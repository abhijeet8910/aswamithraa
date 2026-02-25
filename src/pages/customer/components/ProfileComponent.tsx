import React, { useState, useEffect } from "react";
import {
  Loader2, LogOut, MapPin, Phone, Mail, Edit3, Save, X, Package,
  CreditCard, ChevronRight, User as UserIcon, Settings, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";

const ProfileComponent = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [orderStats, setOrderStats] = useState({ total: 0, totalSpent: 0 });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          userService.getProfile(),
          orderService.getAll({ limit: 200 }).catch(() => ({ orders: [] })),
        ]);
        setProfile({ name: profileData.name || "", email: profileData.email || "", phone: profileData.phone || "" });
        setAddress({
          street: profileData.address?.street || "",
          city: profileData.address?.city || "",
          state: profileData.address?.state || "",
          pincode: profileData.address?.pincode || "",
        });
        const orders = ordersData?.orders || [];
        setOrderStats({
          total: orders.length,
          totalSpent: orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0),
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await userService.updateProfile(profile);
      setEditing(false);
      setMessage("Profile updated!");
      await updateUser();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setSaving(true);
    setMessage("");
    try {
      await userService.updateProfile({ address });
      setEditAddress(false);
      setMessage("Address updated!");
      await updateUser({ address });
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const initials = (profile.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-32 rounded-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500" />
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-green-700 bg-gradient-to-br from-green-100 to-emerald-50">
            {initials}
          </div>
        </div>
      </div>

      {/* Name + Email under avatar */}
      <div className="pl-28 pt-1">
        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes("updated") || message.includes("Updated") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{orderStats.total}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
        </div>
        <div className="bg-white border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">₹{orderStats.totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white border border-green-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-green-50 bg-green-50/50">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-green-700" />
            <span className="text-sm font-semibold text-green-800">Personal Information</span>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Full Name</p>
              {editing ? (
                <input className="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" value={profile.name} onChange={(e) => handleProfileChange("name", e.target.value)} />
              ) : (
                <p className="font-medium text-sm">{profile.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              {editing ? (
                <input className="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" value={profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} />
              ) : (
                <p className="font-medium text-sm">{profile.phone || "Not set"}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-sm">{profile.email}</p>
            </div>
          </div>

          {editing && (
            <button onClick={handleSaveProfile} disabled={saving} className="w-full mt-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          )}
        </div>
      </div>

      {/* Delivery Address Card */}
      <div className="bg-white border border-green-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-green-50 bg-green-50/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-700" />
            <span className="text-sm font-semibold text-green-800">Delivery Address</span>
          </div>
          {!editAddress ? (
            <button onClick={() => setEditAddress(true)} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium">
              <Edit3 className="w-3 h-3" /> {address.city ? "Edit" : "Add"}
            </button>
          ) : (
            <button onClick={() => setEditAddress(false)} className="text-xs text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
          )}
        </div>

        <div className="p-5">
          {editAddress ? (
            <div className="space-y-3">
              <input className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" placeholder="Street / Area" value={address.street} onChange={(e) => handleAddressChange("street", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" placeholder="City" value={address.city} onChange={(e) => handleAddressChange("city", e.target.value)} />
                <input className="px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" placeholder="State" value={address.state} onChange={(e) => handleAddressChange("state", e.target.value)} />
              </div>
              <input className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 text-sm" placeholder="Pincode" value={address.pincode} onChange={(e) => handleAddressChange("pincode", e.target.value)} maxLength={6} />
              <button onClick={handleSaveAddress} disabled={saving} className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Address</>}
              </button>
            </div>
          ) : address.city ? (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                {address.street && <p className="text-sm text-gray-800">{address.street}</p>}
                <p className="text-sm text-gray-800">{address.city}, {address.state}</p>
                <p className="text-sm text-gray-500">{address.pincode}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No address set. Add your delivery address.</p>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white border border-green-100 rounded-xl shadow-sm divide-y divide-green-50">
        {[
          { icon: ShieldCheck, label: "Account Verified", value: authUser?.isVerified ? "Yes" : "Pending", color: authUser?.isVerified ? "text-green-600" : "text-yellow-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
            <span className={`text-sm font-medium ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
};

export default ProfileComponent;