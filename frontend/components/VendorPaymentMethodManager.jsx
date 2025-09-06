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
  Wallet, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Globe,
  Settings,
  Trash2,
  Landmark,
  Smartphone as Phone,
  User
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

const VendorPaymentMethodManager = ({
  vendorId,
  initialPaymentMethod,
  onPaymentMethodUpdate,
  jwt,
}) => {
  const [paymentMethod, setPaymentMethod] = useState({
    provider: initialPaymentMethod?.provider || "paypal",
    accountId: initialPaymentMethod?.accountId || "",
    additionalInfo: initialPaymentMethod?.additionalInfo || "",
  });

  const [showAddForm, setShowAddForm] = useState(!initialPaymentMethod);
  const [saving, setSaving] = useState(false);

  // Payment providers for vendor payment methods
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

  const validatePaymentMethod = () => {
    if (!paymentMethod.accountId.trim()) {
      return "Account ID is required";
    }
    if (paymentMethod.provider === "paypal" && !paymentMethod.accountId.includes("@")) {
      return "Please enter a valid PayPal email address";
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationError = validatePaymentMethod();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      // Create comprehensive paymentMethod object
      const updatedPaymentMethod = {
        provider: paymentMethod.provider,
        accountId: paymentMethod.accountId || "",
        additionalInfo: paymentMethod.additionalInfo || "",
        updatedAt: new Date().toISOString(),
      };

      // Update the vendor's payment method
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              vendorPaymentMethod: updatedPaymentMethod,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update vendor's payment method in local state
        onPaymentMethodUpdate(updatedPaymentMethod);

        toast.success(
          "Perfect! Your payment method has been updated successfully."
        );
        setShowAddForm(false);
      } else {
        console.error("API Error:", data);
        toast.error(
          data?.error?.message ||
            `We couldn't update your payment method (${response.status})`
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
      toast.error(
        "We're having trouble updating your payment method. Please try again in a moment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setPaymentMethod({
      provider: initialPaymentMethod?.provider || "paypal",
      accountId: initialPaymentMethod?.accountId || "",
      additionalInfo: initialPaymentMethod?.additionalInfo || "",
    });
    setShowAddForm(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your payment method? This will prevent you from receiving payments.")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              vendorPaymentMethod: null,
            },
          }),
        }
      );

      if (response.ok) {
        onPaymentMethodUpdate(null);
        toast.success("Payment method removed successfully");
        setShowAddForm(false);
      } else {
        const data = await response.json();
        toast.error(data?.error?.message || "Failed to remove payment method");
      }
    } catch (err) {
      console.error("Error removing payment method:", err);
      toast.error("Failed to remove payment method. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getAccountIdLabel = () => {
    switch (paymentMethod.provider) {
      case "paypal":
        return "PayPal Email";
      case "bank_transfer":
        return "Account Number";
      case "wallet":
        return "Wallet Address";
      case "mobile_money":
        return "Mobile Number";
      default:
        return "Account ID";
    }
  };

  const getAccountIdPlaceholder = () => {
    switch (paymentMethod.provider) {
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

  // Function to check if payment method has meaningful content
  const hasPaymentContent = () => {
    return (
      paymentMethod.provider &&
      paymentMethod.accountId &&
      paymentMethod.accountId.trim() !== ""
    );
  };

  const currentProvider = getProviderInfo(paymentMethod.provider);

  if (!showAddForm) {
    return (
      <div className="space-y-6">
        {hasPaymentContent() ? (
          <div className="rounded-2xl p-8 sm:p-12 md:p-16 shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm min-h-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                   {(() => {
                     const providerInfo = getProviderInfo(paymentMethod.provider);
                     const IconComponent = providerInfo.icon;
                     return (
                       <div 
                         className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                         style={{ backgroundColor: providerInfo.bgColor }}
                       >
                         <IconComponent className="w-10 h-10 text-white" />
                       </div>
                     );
                   })()}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-black text-2xl">
                        {getProviderInfo(paymentMethod.provider).label}
                      </h3>
                      <span className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 border border-green-200 rounded-full flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    </div>
                    {paymentMethod.accountId && (
                      <p className="text-lg text-black font-semibold">
                        {paymentMethod.accountId}
                      </p>
                    )}
                    {paymentMethod.additionalInfo && (
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <p className="text-base text-black">
                          {paymentMethod.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className="py-3 px-8 text-base font-medium bg-white/80 backdrop-blur-sm border border-gray-200 text-black hover:bg-slate-50 rounded-xl shadow-md transition-all flex items-center gap-3 cursor-pointer"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit
                </button>
              </div>
              
              <div className="flex-1 flex items-end">
                <div className="w-full bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">Payment Method Details</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        This payment method is configured and ready to receive payments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 sm:p-12 md:p-16 shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm min-h-[400px]">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="flex flex-col items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-orange-100/80 flex items-center justify-center shadow-xl">
                  <AlertCircle className="w-12 h-12 text-orange-600" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-black font-bold text-3xl flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8" />
                    No Payment Method
                  </h3>
                  <p className="text-black text-lg max-w-lg mx-auto leading-relaxed">
                    Set up your payment method for receiving payments from customers. This will allow you to receive payments securely and efficiently.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="py-4 px-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full shadow-orange-300 shadow-lg transition-all flex items-center gap-3 cursor-pointer text-lg"
                >
                  <Plus className="w-6 h-6" />
                  Add Payment Method
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
          Configure Payment Method
        </h2>
        <p className="text-black mt-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" />
          Set up payment method and account details to receive payments
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
               value={paymentMethod.provider}
               onValueChange={(value) => setPaymentMethod(prev => ({ ...prev, provider: value }))}
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
            type={paymentMethod.provider === "paypal" ? "email" : "text"}
            placeholder={getAccountIdPlaceholder()}
            value={paymentMethod.accountId}
            onChange={(e) => setPaymentMethod(prev => ({ ...prev, accountId: e.target.value }))}
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
              placeholder="Any extra details for payment processing..."
              value={paymentMethod.additionalInfo}
              onChange={(e) => setPaymentMethod(prev => ({ ...prev, additionalInfo: e.target.value }))}
              rows="3"
              className="w-full p-4 pl-12 pt-4 bg-white border border-gray-300 rounded-lg resize-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium rounded-full shadow-orange-300 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

export default VendorPaymentMethodManager;
