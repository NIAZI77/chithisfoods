import React, { useEffect, useState } from "react";
import Spinner from "@/components/BlackSpinner";
import UserStatusBadge from "@/app/components/UserStatusBadge";
import { X } from "lucide-react";
import VendorVerificationModal from "./VendorVerificationModal";

const UserDetailsModal = ({
  user,
  isOpen,
  onClose,
  onBlockUser,
  isLoading,
  onVerifyVendor,
}) => {
  const [vendorData, setVendorData] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorError, setVendorError] = useState(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleVerify = async (documentId, newStatus) => {
    if (!documentId || !newStatus) {
      console.error("Missing required parameters for verification");
      return;
    }
    try {
      await onVerifyVendor(documentId, newStatus);
      handleCloseVendorModal();
    } catch (error) {
      console.error("Error verifying vendor:", error);
    }
  };
  // Fetch vendor data by user email when modal opens and user changes
  useEffect(() => {
    if (isOpen && user && user.email) {
      setVendorLoading(true);
      setVendorError(null);
      setVendorData(null);
      const fetchVendorData = async (email) => {
        try {
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
              data.error?.message || "Unable to retrieve vendor information."
            );
          }
          const vendor = data.data[0];
          if (vendor) {
            setVendorData(vendor);
          } else {
            setVendorData(null);
          }
        } catch (error) {
          setVendorError(error.message || "Failed to load vendor information.");
        } finally {
          setVendorLoading(false);
        }
      };
      fetchVendorData(user.email);
    } else {
      setVendorData(null);
    }
  }, [isOpen, user]);

  const handleCloseVendorModal = () => {
    setIsVendorModalOpen(false);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-2xl w-full sm:max-w-md max-h-[90vh] border border-pink-100 shadow-2xl flex flex-col relative px-6 py-8"
          style={{ minWidth: 340 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-2xl font-extrabold text-pink-600 mb-6 text-left tracking-tight">
            User Details
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[120px]">
              <Spinner />
            </div>
          ) : !user ? (
            <div className="text-center text-gray-500">User not found.</div>
          ) : (
            <>
              <div className="flex flex-col gap-4 text-[17px]">
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Username</span>
                  <span>{user.username}</span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Provider</span>
                  <span className="capitalize">{user.provider}</span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Registration Date</span>
                  <span>
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Status</span>
                  <span className="ml-1">
                    <UserStatusBadge isBlocked={user.blocked} size="default" />
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Confirmed</span>
                  <span>{user.confirmed ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="font-bold">Admin</span>
                  <span>{user.isAdmin ? "Yes" : "No"}</span>
                </div>
              </div>
              {/* Vendor check and button */}
              <div className="mt-2 flex flex-col gap-2">
                {vendorLoading && (
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Spinner /> Checking vendor status...
                  </div>
                )}
                {vendorError && (
                  <div className="text-sm text-red-500">{vendorError}</div>
                )}
                {vendorData && (
                  <button
                    onClick={() => setIsVendorModalOpen(true)}
                    className="text-center block text-red-600 px-4 py-2 rounded-full border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all font-medium mt-2"
                  >
                    Vendor View
                  </button>
                )}
              </div>
              <div className="flex-1" />
              <div className="flex justify-end mt-10">
                <button
                  onClick={() => onBlockUser(user.id, user.blocked)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    user.blocked
                      ? "bg-green-600 text-white shadow-green-300 shadow-md hover:bg-green-700"
                      : "bg-red-600 text-white shadow-red-300 shadow-md hover:bg-red-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ minWidth: 100 }}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Vendor details modal */}
      {isVendorModalOpen && vendorData && (
        <VendorVerificationModal
          vendor={vendorData}
          onClose={handleCloseVendorModal}
          onVerify={handleVerify}
          isLoading={vendorLoading}
        />
      )}
    </>
  );
};

export default UserDetailsModal;
