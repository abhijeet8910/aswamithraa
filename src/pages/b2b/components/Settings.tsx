import React, { useState } from "react";

type BusinessProfile = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
};

const Settings = () => {
  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [kycStatus, setKycStatus] = useState("Pending");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <p className="text-sm text-muted-foreground">
          Complete your business profile and KYC verification
        </p>
      </div>

      {/* BUSINESS INFORMATION */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Business Information</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="businessName"
            placeholder="Business Name"
            value={profile.businessName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="ownerName"
            placeholder="Owner Name"
            value={profile.ownerName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* CONTACT INFORMATION */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Contact Information</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="email"
            placeholder="Business Email"
            value={profile.email}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* BUSINESS ADDRESS */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Business Address</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="address"
            placeholder="Street Address"
            value={profile.address}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="city"
            placeholder="City"
            value={profile.city}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="state"
            placeholder="State"
            value={profile.state}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* BUSINESS REGISTRATION */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Business Registration</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="gstNumber"
            placeholder="GST Number"
            value={profile.gstNumber}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="panNumber"
            placeholder="PAN Number"
            value={profile.panNumber}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* BANK DETAILS */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Bank Details</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="bankName"
            placeholder="Bank Name"
            value={profile.bankName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="accountNumber"
            placeholder="Account Number"
            value={profile.accountNumber}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="ifsc"
            placeholder="IFSC Code"
            value={profile.ifsc}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* DOCUMENT UPLOAD */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">KYC Documents</h2>

        <div className="space-y-3">

          <div>
            <label className="text-sm">Upload GST Certificate</label>
            <input type="file" className="block mt-1" />
          </div>

          <div>
            <label className="text-sm">Upload PAN Card</label>
            <input type="file" className="block mt-1" />
          </div>

          <div>
            <label className="text-sm">Upload Business License</label>
            <input type="file" className="block mt-1" />
          </div>

        </div>

      </div>

      {/* KYC STATUS */}

      <div className="bg-card border rounded-xl p-6 flex justify-between items-center">

        <div>
          <h2 className="font-semibold">KYC Verification</h2>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{kycStatus}</span>
          </p>
        </div>

        <button
          onClick={() => setKycStatus("Submitted")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Submit Verification
        </button>

      </div>

    </div>
  );
};

export default Settings;