"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  FileText, 
  Building2, 
  Wallet, 
  CheckCircle, 
  AlertCircle,
  User,
  Shield,
  Smartphone,
  Globe,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Landmark,
  Smartphone as Phone
} from "lucide-react";
import { RiPaypalFill } from "react-icons/ri";
import { toast } from "react-toastify";
import Spinner from "@/components/WhiteSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";

const RefundDetailsManager = ({
  userId,
  initialRefundDetails,
  onRefundDetailsUpdate,
  jwt,
}) => {
  const [refundDetails, setRefundDetails] = useState({
    provider: initialRefundDetails?.provider || "paypal",
    accountId: initialRefundDetails?.accountId || "",
    additionalInfo: initialRefundDetails?.additionalInfo || "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Payment providers for refund details
  const PAYMENT_PROVIDERS = [
    { 
      value: "paypal", 
      label: "PayPal", 
      bgColor: "#0070ba", 
      icon: RiPaypalFill,
      description: "PayPal account or email"
    },
    { 
      value: "bank_transfer", 
      label: "Bank Transfer", 
      bgColor: "#059669", 
      icon: Landmark,
      description: "Bank account details"
    },
    { 
      value: "wallet", 
      label: "Digital Wallet", 
      bgColor: "#7c3aed", 
      icon: Wallet,
      description: "Digital wallet account"
    },
    { 
      value: "mobile_money", 
      label: "Mobile Money", 
      bgColor: "#dc2626", 
      icon: Phone,
      description: "Mobile money account"
    },
    { 
      value: "other", 
      label: "Other", 
      bgColor: "#6b7280", 
      icon: Globe,
      description: "Other payment method"
    },
  ];

  // Function to automatically update canceled orders with new refund details (hidden from user)
  const updateCanceledOrdersRefundDetails = async (newRefundDetails) => {
    try {
      // Get user email from cookie
      const userEmail = getCookie("user");
      if (!userEmail) {
        console.error("User email not found in cookie");
        return false;
      }

      // Fetch all canceled orders for this user using email
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${userEmail}&filters[orderStatus][$eq]=cancelled&pagination[limit]=9999999999`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch canceled orders:",
          response.status,
          response.statusText
        );
        return false;
      }

      const data = await response.json();
      const canceledOrders = data.data || [];

      if (canceledOrders.length === 0) {
        return true;
      }

      // Update each canceled order with the new refund details
      const updatePromises = canceledOrders.map(async (order) => {
        try {
          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${order.documentId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  refundDetails: {
                    ...newRefundDetails,
                    updatedAt: new Date().toISOString(),
                  },
                },
              }),
            }
          );

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            console.error(
              `Failed to update order ${order.documentId}:`,
              errorData
            );
            return false;
          }

          return true;
        } catch (error) {
          console.error(`Error updating order ${order.documentId}:`, error);
          return false;
        }
      });

      const results = await Promise.all(updatePromises);
      const successCount = results.filter(Boolean).length;
      const failedCount = results.length - successCount;

      if (failedCount > 0) {
        console.warn(
          `${failedCount} orders failed to update out of ${results.length} total`
        );
      } else {
      }

      return successCount > 0;
    } catch (error) {
      console.error("Error updating canceled orders:", error);
      return false;
    }
  };

  const handleRefundDetailsChange = (field, value) => {
    setRefundDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      // Create comprehensive refundDetails object
      const updatedRefundDetails = {
        provider: refundDetails.provider,
        accountId: refundDetails.accountId || "",
        additionalInfo: refundDetails.additionalInfo || "",
        updatedAt: new Date().toISOString(),
      };
      // First, update the user's refund details
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            refundDetails: updatedRefundDetails,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update user's refund details in local state
        onRefundDetailsUpdate(updatedRefundDetails);

        toast.success(
          "Perfect! Your refund details have been updated successfully."
        );
        setShowAddForm(false);

        // Automatically update canceled orders with new refund details

        await updateCanceledOrdersRefundDetails(updatedRefundDetails);
      } else {
        console.error("API Error:", data);
        toast.error(
          data?.error?.message ||
            `We couldn't update your refund details (${response.status})`
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
      toast.error(
        "We're having trouble updating your refund details. Please try again in a moment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setRefundDetails({
      provider: initialRefundDetails?.provider || "paypal",
      accountId: initialRefundDetails?.accountId || "",
      additionalInfo: initialRefundDetails?.additionalInfo || "",
    });
    setShowAddForm(false);
  };

  const getProviderInfo = (providerValue) => {
    const provider = PAYMENT_PROVIDERS.find((p) => p.value === providerValue);
    return provider || { 
      value: "other", 
      label: "Payment Provider", 
      bgColor: "#6b7280", 
      icon: Globe,
      description: "Payment method"
    };
  };

  // Function to check if refund details have meaningful content
  const hasRefundContent = () => {
    return (
      refundDetails.provider &&
      refundDetails.accountId &&
      refundDetails.accountId.trim() !== ""
    );
  };

  // Function to get label text based on selected provider
  const getAccountIdLabel = () => {
    switch (refundDetails.provider) {
      case "paypal":
        return "PayPal Email";
      case "bank_transfer":
        return "Account Number or IBAN";
      case "wallet":
        return "Wallet Address";
      case "mobile_money":
        return "Mobile Number";
      default:
        return "Account ID";
    }
  };

  // Function to get placeholder text based on selected provider
  const getAccountIdPlaceholder = () => {
    const providerInfo = getProviderInfo(refundDetails.provider);
    switch (refundDetails.provider) {
      case "paypal":
        return "PayPal email address";
      case "bank_transfer":
        return "Bank account number or IBAN";
      case "wallet":
        return "Digital wallet address";
      case "mobile_money":
        return "Mobile money account number";
      default:
        return "Account ID, email, or address";
    }
  };

  if (!showAddForm) {
    return (
      <div className="space-y-6">
        {hasRefundContent() ? (
          <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {(() => {
                   const providerInfo = getProviderInfo(refundDetails.provider);
                   const IconComponent = providerInfo.icon;
                   return (
                     <div 
                       className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                       style={{ backgroundColor: providerInfo.bgColor }}
                     >
                       <IconComponent className="w-6 h-6 text-white" />
                     </div>
                   );
                 })()}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-black text-lg">
                      {getProviderInfo(refundDetails.provider).label}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border border-green-200 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                  {refundDetails.accountId && (
                    <p className="text-sm text-black font-medium">
                      {refundDetails.accountId}
                    </p>
                  )}
                  {refundDetails.additionalInfo && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-black">
                        {refundDetails.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="py-2 px-6 text-sm font-medium bg-white/80 backdrop-blur-sm border border-gray-200 text-black hover:bg-slate-50 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-100/80 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-black font-semibold text-xl flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    No Refund Details
                  </h3>
                  <p className="text-black text-sm max-w-md">
                    Set up your refund details for smooth processing and faster refunds
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="py-2 px-6 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full shadow-rose-300 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Refund Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configure Refund Details
        </h2>
        <p className="text-black mt-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" />
          Set up payment method and account details for refunds
        </p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Provider
            </label>
             <Select
               value={refundDetails.provider}
               onValueChange={(value) =>
                 handleRefundDetailsChange("provider", value)
               }
               className="w-full"
             >
               <SelectTrigger className="w-full p-4 bg-white border border-gray-300 rounded-lg">
                 <SelectValue placeholder="Select provider" />
               </SelectTrigger>
              <SelectContent className="w-full">
                {PAYMENT_PROVIDERS.map((provider) => {
                  const IconComponent = provider.icon;
                  return (
                    <SelectItem key={provider.value} value={provider.value} className="w-full">
                      <div className="flex items-center gap-3 w-full p-2">
                        <div 
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: provider.bgColor }}
                        >
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div className="font-medium">{provider.label}</div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black flex items-center gap-2">
            <User className="w-4 h-4" />
            {getAccountIdLabel()}
          </label>
          <input
            type={refundDetails.provider === "paypal" ? "email" : "text"}
            placeholder={getAccountIdPlaceholder()}
            value={refundDetails.accountId}
            onChange={(e) =>
              handleRefundDetailsChange("accountId", e.target.value)
            }
            className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg"
            required
          />
        </div>

         <div className="space-y-2">
           <label className="text-sm font-medium text-black flex items-center gap-2">
             <FileText className="w-4 h-4" />
             Additional Info
           </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
            <textarea
              placeholder="Any extra details for refund processing..."
              value={refundDetails.additionalInfo}
              onChange={(e) =>
                handleRefundDetailsChange("additionalInfo", e.target.value)
              }
              rows="3"
              className="w-full p-4 pl-12 pt-4 bg-white border border-gray-300 rounded-lg resize-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 px-6 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-medium rounded-full shadow-rose-300 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Spinner />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Details
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="py-2 px-6 text-gray-600 rounded-full border-2 border-gray-600 hover:bg-gray-600 hover:text-white transition-all font-medium flex items-center gap-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RefundDetailsManager;
