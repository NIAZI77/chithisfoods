"use client";

import { useState } from "react";
import { CreditCard, Plus, Edit3, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";
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
    { value: "paypal", label: "PayPal", color: "#0070ba" },
    { value: "bank_transfer", label: "Bank Transfer", color: "#059669" },
    { value: "other", label: "Other", color: "#7c3aed" },
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

  const getProviderColor = (providerValue) => {
    const provider = PAYMENT_PROVIDERS.find((p) => p.value === providerValue);
    return provider ? provider.color : "#6b7280";
  };

  const getProviderLabel = (providerValue) => {
    const provider = PAYMENT_PROVIDERS.find((p) => p.value === providerValue);
    return provider ? provider.label : "Payment Provider";
  };

  if (!showAddForm) {
    return (
      <div className="space-y-6">
        {refundDetails.provider ? (
          <div className="border border-green-200 bg-green-50/50 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{
                      backgroundColor: getProviderColor(refundDetails.provider),
                    }}
                  >
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-green-800 text-lg">
                        {getProviderLabel(refundDetails.provider)}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border border-green-200 rounded-full">
                        Active
                      </span>
                    </div>
                    {refundDetails.accountId && (
                      <p className="text-sm text-green-600 font-medium">
                        {refundDetails.accountId}
                      </p>
                    )}
                    {refundDetails.additionalInfo && (
                      <p className="text-sm text-green-600">
                        {refundDetails.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className="px-3 py-2 text-sm font-medium border border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2 inline" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm">
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-lg">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-blue-800 font-semibold text-xl">
                    No refund details
                  </h3>
                  <p className="text-blue-700 text-sm max-w-md">
                    Set up your refund details for smooth processing
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full shadow-rose-300 shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Configure Refund Details
        </h2>
        <p className="text-gray-600 mt-1">
          Set up payment method and account details for refunds
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Payment Provider
              </label>
              <Select
                value={refundDetails.provider}
                onValueChange={(value) =>
                  handleRefundDetailsChange("provider", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: provider.color }}
                        />
                        {provider.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Account ID
            </label>
            <input
              type="text"
              placeholder="Email, account number, etc."
              value={refundDetails.accountId}
              onChange={(e) =>
                handleRefundDetailsChange("accountId", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Additional Info
            </label>
            <textarea
              placeholder="Any extra details for refund processing..."
              value={refundDetails.additionalInfo}
              onChange={(e) =>
                handleRefundDetailsChange("additionalInfo", e.target.value)
              }
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-medium rounded-full shadow-rose-300 shadow-md transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Spinner />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 text-gray-600 rounded-full border-2 border-gray-600 hover:bg-gray-600 hover:text-white transition-all font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundDetailsManager;
