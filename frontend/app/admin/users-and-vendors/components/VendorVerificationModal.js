import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  XCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
  Building2,
  Calendar,
  Eye,
  User,
  OctagonAlert,
} from "lucide-react";
import Spinner from "@/app/components/Spinner";
import VerificationBadge from "@/app/components/VerificationBadge";

const VendorVerificationModal = ({ vendor, onClose, onVerify, isLoading }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [activeTab, setActiveTab] = useState("store");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!vendor) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleVerify = async () => {
    if (!vendor.documentId) {
      console.error("Missing vendor documentId");
      return;
    }
    setIsVerifying(true);
    try {
      await onVerify(vendor.documentId, "verified");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!vendor.documentId) {
      console.error("Missing vendor documentId");
      return;
    }
    setIsRejecting(true);
    try {
      await onVerify(vendor.documentId, "rejected");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleBan = async () => {
    if (!vendor.documentId) {
      console.error("Missing vendor documentId");
      return;
    }
    setIsBanning(true);
    try {
      await onVerify(vendor.documentId, "banned");
    } finally {
      setIsBanning(false);
    }
  };

  const handleUnban = async () => {
    if (!vendor.documentId) {
      console.error("Missing vendor documentId");
      return;
    }
    setIsUnbanning(true);
    try {
      await onVerify(vendor.documentId, "unverified");
    } finally {
      setIsUnbanning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full sm:max-w-2xl max-h-[90vh] border border-pink-100 shadow-xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 rounded-full"
          aria-label="Close modal"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="bg-pink-400 p-6 text-white">
          <div className="flex flex-wrap justify-between items-start gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:mx-0 mx-auto">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                <Image
                  src={vendor.avatar?.url || "/placeholder-avatar.jpg"}
                  alt={vendor.storeName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg md:text-2xl font-bold mb-1">
                  {vendor.storeName}
                </h2>
                <div className="flex items-center gap-2 text-white/80 flex-col sm:flex-row">
                  <p className="text-sm">@{vendor.username}</p>
                  <span className="w-1 h-1 rounded-full bg-white/50 hidden sm:block"></span>
                  <p className="text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {vendor.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <VerificationBadge
              status={vendor.verificationStatus}
              size="large"
            />
            {vendor.createdAt && (
              <span className="text-sm text-white/80 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined on {formatDate(vendor.createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 justify-center">
          <button
            onClick={() => setActiveTab("store")}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "store"
                ? "text-pink-600 border-pink-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building2
              className={`w-4 h-4 ${
                activeTab === "store" ? "text-pink-600" : "text-gray-400"
              }`}
            />
            Store Info
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "contact"
                ? "text-pink-600 border-pink-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User
              className={`w-4 h-4 ${
                activeTab === "contact" ? "text-pink-600" : "text-gray-400"
              }`}
            />
            Contact
          </button>
          <button
            onClick={() => setActiveTab("document")}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "document"
                ? "text-pink-600 border-pink-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText
              className={`w-4 h-4 ${
                activeTab === "document" ? "text-pink-600" : "text-gray-400"
              }`}
            />
            Verification
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {!vendor.verificationDocument && (
            <div className="bg-yellow-50 p-3 rounded-lg flex items-center justify-center gap-2 my-2">
              <OctagonAlert className="w-5 h-5 text-yellow-600" /> Document Not
              Uploaded
            </div>
          )}
          <div className="">
            {activeTab === "store" && (
              <div className="space-y-6 animate-fadeIn flex justify-center">
                <div className="p-4 sm:p-6 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        Business Address
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.businessAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Zipcode
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.zipcode}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Delivery Fee
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        ${vendor.vendorDeliveryFee}
                      </p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500">Bio</p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6 animate-fadeIn flex justify-center">
                <div className="p-4 sm:p-6 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.fullName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-pink-500" />
                        Phone
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.phoneNumber}
                      </p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-pink-500" />
                        PayPal Email
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {vendor.paypalEmail || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "document" && (
              <div className="space-y-6 animate-fadeIn flex justify-center">
                {vendor.verificationDocument ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full max-w-lg">
                    <div className="p-4 sm:p-5 border-b border-gray-100 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 shadow-lg rounded-lg flex-shrink-0">
                            <FileText className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              Verification Document
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Uploaded on{" "}
                              {formatDate(
                                vendor.verificationDocument.createdAt
                              )}
                            </p>
                          </div>
                        </div>
                        <a
                          href={vendor.verificationDocument.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center block text-rose-600 px-4 py-2 rounded-full border-2 border-rose-600 hover:bg-rose-600 hover:text-white transition-all font-medium flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center w-full max-w-lg">
                    <div className="p-3 bg-pink-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-pink-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No Document Uploaded
                    </h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm sm:text-base">
                      This vendor needs to upload their verification document
                      before proceeding with verification.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-pink-50">
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            {vendor.verificationStatus === "banned" ? (
              <button
                onClick={handleUnban}
                disabled={isLoading || isUnbanning}
                className="bg-green-600 text-white px-4 py-2 rounded-full shadow-green-300 shadow-md hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUnbanning ? (
                  <Spinner size={20} color="white" />
                ) : (
                  "Unban Vendor"
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleBan}
                  disabled={isLoading || isBanning}
                  className="bg-red-600 text-white px-4 py-2 rounded-full shadow-red-300 shadow-md hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isBanning ? (
                    <Spinner size={20} color="white" />
                  ) : (
                    "Ban Vendor"
                  )}
                </button>
                {vendor.verificationDocument && (
                  <>
                    <button
                      onClick={handleReject}
                      disabled={
                        isLoading ||
                        isRejecting ||
                        vendor.verificationStatus === "rejected"
                      }
                      className="bg-amber-600 text-white px-4 py-2 rounded-full shadow-amber-300 shadow-md hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isRejecting ? (
                        <Spinner size={20} color="white" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                    <button
                      onClick={handleVerify}
                      disabled={
                        isLoading ||
                        isVerifying ||
                        vendor.verificationStatus === "verified"
                      }
                      className="bg-rose-600 text-white px-4 py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isVerifying ? (
                        <Spinner size={20} color="white" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorVerificationModal;
