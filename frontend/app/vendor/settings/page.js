"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
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
import Spinner from "@/app/components/Spinner";

const INITIAL_FORM_STATE = {
  storeName: "",
  email: "",
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
  "storeName",
  "email",
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
      toast.error("Please login to access this page");
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
        throw new Error(data.error?.message || "Failed to fetch vendor data");
      }

      const vendorData = data.data[0];
      if (!vendorData) {
        toast.info("Please complete your vendor registration");
        router.push("/become-vendor");
        return;
      }

      setFormData({
        ...vendorData,
        bio: vendorData.bio || "",
        avatar: vendorData.avatar || { id: 0, url: "" },
        coverImage: vendorData.coverImage || { id: 0, url: "" },
      });
    } catch (error) {
      toast.error(error.message || "Unable to load vendor information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const uploadImage = async (file, name) => {
    const formData = new FormData();
    formData.append("files", file);
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Error uploading image.");
        return;
      }

      const data = await response.json();
      if (!data || !data[0]) {
        toast.error("Invalid response from server");
        return;
      }

      const { id, url } = data[0];
      const fullUrl = url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_STRAPI_HOST}${url}`;

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url: fullUrl },
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image.");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) uploadImage(file, name);
  };

  const validateForm = () => {
    const missingFields = REQUIRED_FIELDS.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((field) =>
        field.replace(/([A-Z])/g, " $1").toLowerCase()
      );
      toast.error(
        `Please fill in the following required fields: ${fieldNames.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const jwt = getCookie("jwt");
    if (formData.zipcode.length !== 5) {
      toast.error("ZIP Code must be 5 digits.");
      return;
    }
    if (!jwt) {
      toast.error("Your session has expired. Please login again");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      // First update the vendor's information
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
              storeName: formData.storeName,
              email: formData.email,
              bio: formData.bio || "",
              fullName: formData.fullName,
              phoneNumber: formData.phoneNumber,
              businessAddress: formData.businessAddress,
              city: formData.city,
              zipcode: formData.zipcode,
              username: formData.username,
              ...(formData.avatar?.id && { avatar: formData.avatar.id }),
              ...(formData.coverImage?.id && {
                coverImage: formData.coverImage.id,
              }),
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update settings");
      }

      // Then update all dishes' zipcodes
      const dishesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[vendorId][$eq]=${formData.documentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const dishesData = await dishesResponse.json();
      
      if (dishesResponse.ok && dishesData.data) {
        // Update each dish's zipcode
        const updatePromises = dishesData.data.map(dish => 
          fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dish.documentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
              body: JSON.stringify({
                data: {
                  zipcode: formData.zipcode
                }
              }),
            }
          )
        );

        await Promise.all(updatePromises);
      }

      toast.success("Settings updated successfully");
      setTimeout(() => router.push("/vendor/dashboard"), 1000);
    } catch (error) {
      toast.error(
        error.message || "Failed to update settings. Please try again"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 w-full pl-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
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
                className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Tell us about your store..."
            />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media
          </h2>
          <div className="relative w-full mb-16">
            <div
              className="bg-cover bg-center w-full aspect-video rounded-lg"
              style={{
                backgroundImage: formData.coverImage?.url
                  ? `url('${formData.coverImage.url}')`
                  : "url('/fallback.png')",
              }}
            >
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <label
                htmlFor="coverImage"
                className="w-8 h-8 overflow-hidden absolute right-2 bottom-2 cursor-pointer bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <FaCamera />
              </label>
            </div>

            <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <Image
                height={100}
                width={100}
                src={formData.avatar?.url || "/fallback.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-[-40px] cursor-pointer left-1/2 transform -translate-x-1/2 w-8 h-8 overflow-hidden bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <FaCamera />
            </label>
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
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="md:w-auto w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5" />
            {submitting ? <Spinner/> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
