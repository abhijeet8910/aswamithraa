import React, { useState, useEffect } from "react";

type Address = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
};

/* ========================= */
/* MOCK API DATA             */
/* ========================= */

const mockUser: UserProfile = {
  id: "USR001",
  name: "Abhijeet Kumar",
  email: "abhijeet@email.com",
  phone: "+91 9876543210",
  address: {
    street: "Banjara Hills Road 12",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
  },
};

const ProfileComponent = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ========================= */
  /* FETCH USER (API Later)    */
  /* ========================= */

  useEffect(() => {
    const fetchUser = async () => {
      // later replace with API call
      setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
      }, 500);
    };

    fetchUser();
  }, []);

  /* ========================= */
  /* HANDLE INPUT CHANGE       */
  /* ========================= */

  const handleChange = (field: string, value: string) => {
    if (!user) return;

    if (field in user.address) {
      setUser({
        ...user,
        address: {
          ...user.address,
          [field]: value,
        },
      });
    } else {
      setUser({
        ...user,
        [field]: value,
      });
    }
  };

  /* ========================= */
  /* SAVE PROFILE (API later)  */
  /* ========================= */

  const handleSave = async () => {
    setEditing(false);

    console.log("Updated User Data:", user);

    // later
    // await axios.put("/api/user/profile", user)
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      <h2 className="text-xl font-bold text-green-800">
        My Profile
      </h2>

      <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm space-y-5">

        {/* NAME */}

        <div>
          <p className="text-sm text-gray-500">Full Name</p>

          {editing ? (
            <input
              className="border rounded px-3 py-2 w-full"
              value={user.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />
          ) : (
            <p className="font-medium">{user.name}</p>
          )}
        </div>

        {/* PHONE */}

        <div>
          <p className="text-sm text-gray-500">Phone Number</p>

          {editing ? (
            <input
              className="border rounded px-3 py-2 w-full"
              value={user.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />
          ) : (
            <p className="font-medium">{user.phone}</p>
          )}
        </div>

        {/* EMAIL */}

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        {/* ADDRESS */}

        <div className="space-y-2">

          <p className="text-sm text-gray-500">
            Delivery Address
          </p>

          {editing ? (
            <div className="grid gap-2">

              <input
                className="border rounded px-3 py-2"
                value={user.address.street}
                onChange={(e) =>
                  handleChange("street", e.target.value)
                }
                placeholder="Street"
              />

              <input
                className="border rounded px-3 py-2"
                value={user.address.city}
                onChange={(e) =>
                  handleChange("city", e.target.value)
                }
                placeholder="City"
              />

              <input
                className="border rounded px-3 py-2"
                value={user.address.state}
                onChange={(e) =>
                  handleChange("state", e.target.value)
                }
                placeholder="State"
              />

              <input
                className="border rounded px-3 py-2"
                value={user.address.pincode}
                onChange={(e) =>
                  handleChange("pincode", e.target.value)
                }
                placeholder="Pincode"
              />

            </div>
          ) : (
            <p className="font-medium">
              {user.address.street}, {user.address.city},{" "}
              {user.address.state} - {user.address.pincode}
            </p>
          )}

        </div>

      </div>

      {/* ACTION BUTTON */}

      <div className="flex gap-3">

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Save Profile
          </button>
        )}

      </div>

    </div>
  );
};

export default ProfileComponent;