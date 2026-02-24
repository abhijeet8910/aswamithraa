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

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">

        <h1 className="text-2xl font-bold">
          Farmer Profile & Verification
        </h1>

        <p className="text-sm opacity-90">
          Complete your profile and submit KYC for approval
        </p>

      </div>


      {/* PERSONAL DETAILS */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="font-semibold text-lg text-gray-700">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="farmerName"
            placeholder="Farmer Name"
            value={profile.farmerName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

        </div>

      </div>


      {/* FARM DETAILS */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="font-semibold text-lg text-gray-700">
          Farm Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="farmName"
            placeholder="Farm Name"
            value={profile.farmName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="farmLocation"
            placeholder="Farm Location"
            value={profile.farmLocation}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="state"
            placeholder="State"
            value={profile.state}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="cropType"
            placeholder="Main Crops"
            value={profile.cropType}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

        </div>

      </div>


      {/* BANK DETAILS */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="font-semibold text-lg text-gray-700">
          Bank Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="bankName"
            placeholder="Bank Name"
            value={profile.bankName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="accountNumber"
            placeholder="Account Number"
            value={profile.accountNumber}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="ifsc"
            placeholder="IFSC Code"
            value={profile.ifsc}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

        </div>

      </div>


      {/* KYC DETAILS */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="font-semibold text-lg text-gray-700">
          KYC Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="aadhaar"
            placeholder="Aadhaar Number"
            value={profile.aadhaar}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="pan"
            placeholder="PAN Number"
            value={profile.pan}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

        </div>

      </div>


      {/* DOCUMENT UPLOAD */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="font-semibold text-lg text-gray-700">
          Upload Documents
        </h2>

        <div className="space-y-3">

          <input type="file" />

          <input type="file" />

          <input type="file" />

        </div>

      </div>


      {/* KYC STATUS */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm flex justify-between items-center">

        <div>

          <h2 className="font-semibold">
            Verification Status
          </h2>

          <p className="text-sm text-gray-500">
            Status: 
            <span className="ml-2 px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
              {kycStatus}
            </span>
          </p>

        </div>

        <button
          onClick={() => setKycStatus("Submitted")}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Submit for Verification
        </button>

      </div>

    </div>
  );
};

export default FarmerSettings;