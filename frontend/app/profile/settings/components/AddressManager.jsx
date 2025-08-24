"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import Spinner from "@/app/components/Spinner";
import Loading from "@/app/loading";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const userCookie = getCookie("user");
  const jwt = getCookie("jwt");

  const initializeAddressesField = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const initResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            addresses: []
          }),
        }
      );

      if (initResponse.ok) {
        console.log("Addresses field initialized successfully");
        setAddresses([]);
      } else {
        console.error("Failed to initialize addresses field");
        setAddresses([]);
      }
    } catch (initError) {
      console.error("Error initializing addresses field:", initError);
      setAddresses([]);
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (!jwt) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      console.log("User data from API:", userData);

      // Check if addresses field exists and is not null, if not initialize it
      if (!userData.addresses || userData.addresses === null) {
        console.log("Addresses field is null or missing, initializing...");
        await initializeAddressesField(userData.id);
      } else {
        const userAddresses = Array.isArray(userData.addresses) ? userData.addresses : [];
        console.log("User addresses:", userAddresses);
        setAddresses(userAddresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [jwt, initializeAddressesField]);

  useEffect(() => {
    if (jwt) {
      fetchAddresses();
    }
  }, [jwt, fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jwt) {
      toast.error("Please log in to save addresses.");
      return;
    }

    // Validation matching checkout page logic
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      return;
    }

    if (!formData.phone || formData.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (!formData.address || formData.address.trim().length < 5) {
      toast.error("Please enter a valid address (at least 5 characters)");
      return;
    }

    setSaving(true);

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }

      const newAddress = {
        id: editingId || Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      // Check for duplicate addresses (matching checkout logic)
      const existingAddresses = Array.isArray(addresses) ? addresses : [];
      const isDuplicate = existingAddresses.some(addr =>
        addr.name.toLowerCase() === newAddress.name.toLowerCase() &&
        addr.phone === newAddress.phone &&
        addr.address.toLowerCase() === newAddress.address.toLowerCase()
      );

      if (isDuplicate && !editingId) {
        toast.error("This address is already saved");
        setSaving(false);
        return;
      }

      let updatedAddresses;

      if (editingId) {
        updatedAddresses = existingAddresses.map(addr =>
          addr.id === editingId ? newAddress : addr
        );
      } else {
        updatedAddresses = [...existingAddresses, newAddress];
      }

      console.log("Saving address for user:", userData.id);
      console.log("Address data:", updatedAddresses);

      // Try using the user's JWT token first (matching checkout logic)
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            addresses: updatedAddresses
          }),
        }
      );

      // If user JWT fails, try with admin token (matching checkout logic)
      if (!response.ok) {
        console.log("User JWT failed, trying admin token...");
        response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              addresses: updatedAddresses
            }),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error?.message || `Failed to save address: ${response.status}`);
      }

      setAddresses(updatedAddresses);
      toast.success(editingId ? "Address updated successfully" : "Address saved successfully");
      resetForm();

      // Refresh addresses to ensure consistency
      await fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);

      // Provide more specific error messages
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        toast.error("Permission denied. Please contact support.");
      } else if (error.message.includes("404")) {
        toast.error("User not found. Please log in again.");
      } else if (error.message.includes("500")) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || `Failed to save address`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!jwt) {
      toast.error("Please log in to manage addresses.");
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }

      const updatedAddresses = (addresses || []).filter(addr => addr.id !== addressId);

      // Try user JWT first, then admin token (matching checkout logic)
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            addresses: updatedAddresses
          }),
        }
      );

      if (!response.ok) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              addresses: updatedAddresses
            }),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete API Error:", errorData);
        throw new Error(errorData.error?.message || `Failed to delete address: ${response.status}`);
      }

      setAddresses(updatedAddresses);
      toast.success("Address deleted successfully");

      // Refresh addresses to ensure consistency
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <section className="border p-6 rounded-2xl shadow-sm border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight text-rose-600 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Saved Addresses
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-2xl bg-gray-50 border-gray-200">
          <h3 className="font-black text-lg mb-6 text-black">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                  minLength="2"
                  title="Please enter your full name (at least 2 characters)"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                  pattern="[0-9 +-]+"
                  title="Please enter a valid phone number (at least 10 digits)"
                  minLength="10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-sm text-slate-500 pl-3">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street Address"
                className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                minLength="5"
                title="Please enter your complete street address (at least 5 characters)"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-rose-600 text-white px-6 py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Spinner /> : <Check className="w-4 h-4" />}
                {saving ? "Saving..." : (editingId ? "Update" : "Save")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses && addresses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <p className="text-lg font-medium mb-2">No saved addresses yet</p>
          <p className="text-sm text-gray-400">Add your first address to get started</p>
          <p className="text-xs text-gray-400 mt-2">
            Your saved addresses will be available during checkout for quick delivery setup.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(addresses || []).map((address) => (
            <div
              key={address.id}
              className="p-4 border rounded-xl cursor-pointer transition-all border-gray-200 hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{address.name}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                  <p className="text-gray-800">{address.address}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100 transition-all"
                    title="Edit address"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-xl hover:bg-red-50 transition-all"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AddressManager;
