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
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import Spinner from "@/components/WhiteSpinner";
import Link from "next/link";
import VerificationBadge from "@/app/components/VerificationBadge";
import VendorProfileLayout from "@/components/VendorProfileLayout";

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
  vendorDeliveryFee: "",
  verificationDocument: null,
  verificationStatus: "unverified",
};

const REQUIRED_FIELDS = [
  "storeName",
  "email",
  "businessAddress",
  "city",
  "zipcode",
];

function formatToTwoDecimals(val) {
  let value = val.replace(/[^0-9.]/g, "");
  value = value.replace(/(\..*)\./g, "$1");
  if (value.includes(".")) {
    const [intPart, decPart] = value.split(".");
    return intPart + "." + decPart.slice(0, 2);
  }
  return value;
}

const Page = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [uploadingDocument, setUploadingDocument] = useState(false);

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
        ...vendorData,
        bio: vendorData.bio || "",
        avatar: vendorData.avatar || { id: 0, url: "" },
        coverImage: vendorData.coverImage || { id: 0, url: "" },
        vendorDeliveryFee:
          vendorData.vendorDeliveryFee !== null &&
          vendorData.vendorDeliveryFee !== undefined
            ? Number(vendorData.vendorDeliveryFee).toFixed(2)
            : "",
        verificationDocument: vendorData.verificationDocument || null,
        verificationStatus: vendorData.verificationStatus || "unverified",
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
    if (name === "vendorDeliveryFee") {
      setFormData((prev) => ({ ...prev, [name]: formatToTwoDecimals(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadVerificationDocument = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("files", file);

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed for verification documents.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB to continue.");
      return;
    }

    setUploadingDocument(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        toast.error(
          "We couldn't upload your document right now. Please try again."
        );
        return;
      }

      const data = await response.json();
      if (!data || !data[0]) {
        toast.error(
          "We received an unexpected response while uploading your document. Please try again."
        );
        return;
      }

      const { id, url } = data[0];
      const fullUrl = url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_STRAPI_HOST}${url}`;

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${formData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              verificationDocument: id,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        toast.error(
          "We couldn't update your vendor profile with the verification document right now. Please try again."
        );
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        verificationDocument: {
          id,
          url: fullUrl,
          createdAt: new Date().toISOString(),
        },
      }));

      toast.success(
        "Excellent! Your verification document has been uploaded successfully!"
      );
    } catch (error) {
      toast.error(
        "We're having trouble uploading your document right now. Please try again."
      );
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleVerificationFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadVerificationDocument(file);
    }
  };

  const getVerificationStatusConfig = (status) => {
    const statusConfig = {
      verified: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle className="w-5 h-5" />,
        label: "Verified",
        description: "Your account has been verified by our team.",
        gradient: "from-emerald-50 to-green-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
      },
      "new-chef": {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: <Clock className="w-5 h-5" />,
        label: "New Chef",
        description: "Your account is being reviewed by our team.",
        gradient: "from-slate-50 to-gray-50",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
      },
      banned: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <XCircle className="w-5 h-5" />,
        label: "Banned",
        description: "Your account has been suspended. Please contact support.",
        gradient: "from-rose-50 to-red-50",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
      },
      unverified: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: <AlertCircle className="w-5 h-5" />,
        label: "Unverified",
        description:
          "Please upload your verification document to get verified.",
        gradient: "from-orange-50 to-amber-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      rejected: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: <XCircle className="w-5 h-5" />,
        label: "Rejected",
        description:
          "Your verification was rejected. Please upload a new document.",
        gradient: "from-orange-50 to-red-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    };

    return statusConfig[status] || statusConfig.unverified;
  };

  const validateForm = () => {
    const missingFields = REQUIRED_FIELDS.filter((field) => !formData[field]);
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
    let deliveryFee = formData.vendorDeliveryFee;
    if (
      deliveryFee === "" ||
      deliveryFee === null ||
      deliveryFee === undefined
    ) {
      deliveryFee = null;
    } else {
      let num = parseFloat(deliveryFee);
      if (isNaN(num) || num < 0) {
        toast.error(
          "Please enter a valid delivery fee (non-negative number with up to two decimal places)."
        );
        return;
      } else if (num === 0) {
        deliveryFee = "0.00";
      } else {
        deliveryFee = num.toFixed(2);
      }
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
              storeName: formData.storeName,
              email: formData.email,
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
              vendorDeliveryFee: deliveryFee,
            },
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Failed to update your settings. Please try again later."
        );
      }
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
        const updatePromises = dishesData.data.map((dish) =>
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
                  zipcode: formData.zipcode,
                },
              }),
            }
          )
        );
        await Promise.all(updatePromises);
      }
      toast.success("Perfect! Your settings have been updated successfully.");
      setTimeout(() => router.push("/vendor/dashboard"), 1000);
    } catch (error) {
      toast.error(
        error.message ||
          "We're having trouble updating your settings right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              htmlFor="vendorDeliveryFee"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delivery Fee
            </label>
            <input
              name="vendorDeliveryFee"
              id="delivery-free"
              type="text"
              value={formData.vendorDeliveryFee}
              onChange={handleChange}
              placeholder="Delivery Fee"
              className="w-full p-2 border border-gray-300 rounded-md "
              inputMode="decimal"
              pattern="^\d*(\.\d{0,2})?$"
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

      <section
        className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-gray-100"
        id="account-verification"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          Account Verification
        </h2>

        <div className="space-y-6">
          <div
            className={`bg-gradient-to-r ${
              getVerificationStatusConfig(formData.verificationStatus).gradient
            } rounded-xl p-6 border ${
              getVerificationStatusConfig(formData.verificationStatus).border
            } shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    getVerificationStatusConfig(formData.verificationStatus)
                      .iconBg
                  } shadow-sm`}
                >
                  <div
                    className={
                      getVerificationStatusConfig(formData.verificationStatus)
                        .iconColor
                    }
                  >
                    {
                      getVerificationStatusConfig(formData.verificationStatus)
                        .icon
                    }
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {
                      getVerificationStatusConfig(formData.verificationStatus)
                        .label
                    }
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {
                      getVerificationStatusConfig(formData.verificationStatus)
                        .description
                    }
                  </p>
                </div>
              </div>
              <div>
                <VerificationBadge
                  status={formData.verificationStatus}
                  size="small"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Verification Document
            </h4>

            {formData.verificationDocument ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-red-50 rounded-lg shadow-sm flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Verification Document
                      </p>
                      <p className="text-gray-500 text-xs">PDF Document</p>
                      {formData.verificationDocument.createdAt && (
                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {formatDate(formData.verificationDocument.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Link
                      href={formData.verificationDocument.url}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-2 px-6 bg-orange-600 text-white rounded-full shadow-orange-300 shadow-md hover:bg-orange-700 transition-all text-xs font-medium flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </Link>
                    {formData.verificationStatus !== "verified" && (
                      <button
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf";
                          input.onchange = handleVerificationFileChange;
                          input.click();
                        }}
                        disabled={uploadingDocument}
                        className="w-full sm:w-auto py-2 px-6 bg-gray-600 text-white rounded-full shadow-gray-300 shadow-md hover:bg-gray-700 transition-all text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingDocument ? (
                          <>
                            <Spinner />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Replace
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-all duration-200 bg-white">
                <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  {uploadingDocument ? (
                    <Spinner />
                  ) : (
                    <Upload className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                <h5 className="text-xl font-semibold text-gray-900 mb-2">
                  {uploadingDocument
                    ? "Uploading Document..."
                    : "Upload Verification Document"}
                </h5>
                <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  Please upload a PDF document for verification. This could be a
                  business license, food service permit, or any official
                  document that verifies your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf";
                      input.onchange = handleVerificationFileChange;
                      input.click();
                    }}
                    disabled={uploadingDocument}
                    className="py-2 px-6 bg-orange-600 text-white rounded-full shadow-orange-300 shadow-md hover:bg-orange-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingDocument ? (
                      <>
                        <Spinner />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Choose PDF File
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    id="verificationDocument"
                    onChange={handleVerificationFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Maximum file size: 10MB • Only PDF files allowed
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Verification Requirements
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                <span className="leading-relaxed">
                  Valid business license or food service permit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                <span className="leading-relaxed">
                  Government-issued ID or business registration
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                <span className="leading-relaxed">
                  Health department certification (if applicable)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                <span className="leading-relaxed">
                  Document must be in PDF format and clearly legible
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;