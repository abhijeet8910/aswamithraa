import React, { useState } from "react";

type FarmerProfile = {
  farmerName: string;
  phone: string;
  email: string;
  farmName: string;
  farmLocation: string;
  state: string;
  cropType: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  aadhaar: string;
  pan: string;
};

const FarmerSettings = () => {
  const [profile, setProfile] = useState<FarmerProfile>({
    farmerName: "",
    phone: "",
    email: "",
    farmName: "",
    farmLocation: "",
    state: "",
    cropType: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    aadhaar: "",
    pan: "",
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

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Farmer Profile</h1>
        <p className="text-sm text-muted-foreground">
          Complete your farmer profile and verification details
        </p>
      </div>

      {/* PERSONAL DETAILS */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Personal Information</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="farmerName"
            placeholder="Farmer Name"
            value={profile.farmerName}
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

          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* FARM INFORMATION */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Farm Information</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="farmName"
            placeholder="Farm Name"
            value={profile.farmName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="farmLocation"
            placeholder="Farm Location"
            value={profile.farmLocation}
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

          <input
            name="cropType"
            placeholder="Main Crops (Rice, Wheat, Vegetables...)"
            value={profile.cropType}
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

      {/* KYC DETAILS */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">KYC Details</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="aadhaar"
            placeholder="Aadhaar Number"
            value={profile.aadhaar}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="pan"
            placeholder="PAN Number"
            value={profile.pan}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* DOCUMENT UPLOAD */}

      <div className="bg-card border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">Upload Documents</h2>

        <div className="space-y-3">

          <div>
            <label className="text-sm">Upload Aadhaar Card</label>
            <input type="file" className="block mt-1" />
          </div>

          <div>
            <label className="text-sm">Upload PAN Card</label>
            <input type="file" className="block mt-1" />
          </div>

          <div>
            <label className="text-sm">Upload Land Ownership Proof</label>
            <input type="file" className="block mt-1" />
          </div>

        </div>

      </div>

      {/* VERIFICATION STATUS */}

      <div className="bg-card border rounded-xl p-6 flex justify-between items-center">

        <div>
          <h2 className="font-semibold">Verification Status</h2>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{kycStatus}</span>
          </p>
        </div>

        <button
          onClick={() => setKycStatus("Submitted")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Submit for Verification
        </button>

      </div>

    </div>
  );
};

export default FarmerSettings;