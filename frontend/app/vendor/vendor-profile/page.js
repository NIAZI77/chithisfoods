"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import {
  Mail,
  Store,
  Image as ImageIcon,
  User,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import Spinner from "@/components/WhiteSpinner";
import VendorProfileLayout from "@/components/VendorProfileLayout";

const INITIAL_FORM_STATE = {
  email: "",
  storeName: "",
  bio: "",
  fullName: "",
  phoneNumber: "",
  businessAddress: "",
  city: "",
  zipcode: "",
  username: "",
  avatar: { id: 0, url: "" },
  coverImage: { id: 0, url: "" },
};

const REQUIRED_FIELDS = [
  "email",
  "storeName",
  "businessAddress",
  "city",
  "zipcode",
];

const Page = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");
    if (!jwt || !user) {
      toast.error("Please sign in to access your account settings.");
      router.push("/login");
      return;
    }
    fetchVendorData(user);
  }, [router]);

  const fetchVendorData = async (email) => {
    try {
      setLoading(true);
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Unable to retrieve vendor information. Please try again later."
        );
      }
      const vendorData = data.data[0];
      if (!vendorData) {
        toast.info(
          "Please complete your vendor registration to access settings."
        );
        router.push("/become-a-vendor");
        return;
      }
      setFormData({
        documentId: vendorData.documentId,
        email: vendorData.email || "",
        storeName: vendorData.storeName || "",
        bio: vendorData.bio || "",
        fullName: vendorData.fullName || "",
        phoneNumber: vendorData.phoneNumber || "",
        businessAddress: vendorData.businessAddress || "",
        city: vendorData.city || "",
        zipcode: vendorData.zipcode || "",
        username: vendorData.username || "",
        avatar: vendorData.avatar || { id: 0, url: "" },
        coverImage: vendorData.coverImage || { id: 0, url: "" },
      });
    } catch (error) {
      toast.error(
        "We're having trouble loading your vendor information. Please refresh the page or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      return !formData[field];
    });
    if (missingFields.length > 0) {
      const fieldNames = missingFields
        .map((field) => field.replace(/([A-Z])/g, " $1").toLowerCase())
        .join(", ");
      toast.error(`Please complete all required fields: ${fieldNames}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const jwt = getCookie("jwt");
    if (formData.zipcode.length !== 5) {
      toast.error("Please enter a valid 5-digit ZIP code to continue.");
      return;
    }
    if (!jwt) {
      toast.error(
        "Your session has expired. Please sign in again to continue."
      );
      router.push("/login");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${formData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              email: formData.email,
              storeName: formData.storeName,
              bio: formData.bio || "",
              fullName: formData.fullName,
              phoneNumber: formData.phoneNumber,
              businessAddress: formData.businessAddress,
              city: formData.city,
              zipcode: formData.zipcode,
              username: formData.username,
              ...(formData.avatar?.id ? { avatar: formData.avatar.id } : {}),
              ...(formData.coverImage?.id ? {
                coverImage: formData.coverImage.id,
              } : {}),
            },
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Failed to update your profile. Please try again later."
        );
      }
      toast.success("Perfect! Your profile has been updated successfully.");
      setTimeout(() => router.push("/vendor/dashboard"), 1000);
    } catch (error) {
      toast.error(
        error.message ||
          "We're having trouble updating your profile right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 w-full pl-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Vendor Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account Information
          </h2>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                name="email"
                type="email"
                value={formData.email}
                readOnly
                className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                name="username"
                type="username"
                value={formData.username}
                readOnly
                className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-100 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </h2>
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name
            </label>
            <input
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Enter your store name"
              required
              className="w-full p-2 border border-gray-300 rounded-md "
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md  resize-none"
              placeholder="Tell us about your store..."
            />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media
          </h2>
          <div className="mb-12">
            <VendorProfileLayout
              onCoverImageUpload={(imageData) => {
                setFormData((prev) => ({
                  ...prev,
                  coverImage: imageData,
                }));
              }}
              onCoverImageRemove={() => {
                setFormData((prev) => ({
                  ...prev,
                  coverImage: { id: 0, url: "" },
                }));
              }}
              onAvatarUpload={(imageData) => {
                setFormData((prev) => ({
                  ...prev,
                  avatar: imageData,
                }));
              }}
              onAvatarRemove={() => {
                setFormData((prev) => ({
                  ...prev,
                  avatar: { id: 0, url: "" },
                }));
              }}
              currentCoverImageUrl={formData.coverImage?.url || null}
              currentAvatarUrl={formData.avatar?.url || null}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md "
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h2>
          <div>
            <label
              htmlFor="businessAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Enter your business address"
                required
                className="w-full p-2 pl-10 border border-gray-300 rounded-md "
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
                className="w-full p-2 border border-gray-300 rounded-md "
              />
            </div>
            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zipcode
              </label>
              <input
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Enter your zipcode"
                required
                className="w-full p-2 border border-gray-300 rounded-md "
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="md:w-auto w-full py-2 px-6 bg-orange-600 text-white rounded-full shadow-orange-300 shadow-md hover:bg-orange-700  disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5" />
            {submitting ? <Spinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
