"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  Pencil,
  Zap,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const TransactionStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div className="bg-emerald-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-emerald-100 p-3 rounded-full mr-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <p className="text-emerald-700 font-medium">Paid Orders</p>
          <p className="text-xl font-bold text-emerald-800">
            {stats.paidOrders}
          </p>
        </div>
      </div>
      <div className="border-t border-emerald-200 pt-4">
        <p className="text-sm text-emerald-600">Total Received</p>
        <p className="text-xl font-bold text-emerald-800">
          ${stats.totalReceived.toFixed(2)}
        </p>
      </div>
    </div>

    <div className="bg-amber-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-amber-100 p-3 rounded-full mr-4">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <p className="text-amber-700 font-medium">Unpaid Orders</p>
          <p className="text-2xl font-bold text-amber-800">
            {stats.unpaidOrders}
          </p>
        </div>
      </div>
      <div className="border-t border-amber-200 pt-4">
        <p className="text-sm text-amber-600">Pending Payment</p>
        <p className="text-xl font-bold text-amber-800">
          ${stats.pendingAmount.toFixed(2)}
        </p>
      </div>
    </div>

    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-slate-100 p-3 rounded-full mr-4">
          <svg
            className="h-8 w-8 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-slate-700 font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-slate-800">
            {stats.totalOrders}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-600">Total Payment</p>
        <p className="text-xl font-bold text-slate-800">
          ${stats.totalPayment.toFixed(2)}
        </p>
      </div>
    </div>
  </div>
);

const TransactionListByDate = ({ transactions }) => {
  const calculateTotal = (subtotal, deliveryFee) => subtotal + deliveryFee;

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.createdAt);
    const dateKey = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  if (transactions?.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-1">
          <div className="flex items-center space-x-2  mt-12">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h3 className="text-lg font-semibold text-gray-700 px-4">{date}</h3>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="space-y-4 pl-4">
            {groupedTransactions[date].map((transaction) => {
              const total = calculateTotal(
                transaction.subtotal,
                transaction.vendorDeliveryFee
              );
              return (
                <div key={transaction.orderId}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Order #{transaction.orderId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <span
                        className={`w-24 flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.vendorPaymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {transaction.vendorPaymentStatus}
                      </span>
                      <p
                        className={`font-semibold ${
                          transaction.vendorPaymentStatus === "PAID"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const TransactionList = ({ transactions }) => {
  return <TransactionListByDate transactions={transactions} />;
};

const PayPalConnection = ({
  isConnected,
  email,
  emailError,
  isEditing,
  tempEmail,
  onConnect,
  onDisconnect,
  onEmailChange,
  onStartEditing,
  onUpdateEmail,
  onCancelEditing,
  isSaving,
}) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center">
      <img src="/paypal.png" alt="PayPal" className="w-64 object-contain" />
    </div>

    <div className="text-center">
      {!isConnected ? (
        <PayPalConnectForm
          email={email}
          emailError={emailError}
          onEmailChange={onEmailChange}
          onConnect={onConnect}
          isSaving={isSaving}
        />
      ) : (
        <PayPalConnectedView
          email={email}
          isEditing={isEditing}
          tempEmail={tempEmail}
          emailError={emailError}
          onStartEditing={onStartEditing}
          onEmailChange={onEmailChange}
          onUpdateEmail={onUpdateEmail}
          onCancelEditing={onCancelEditing}
          onDisconnect={onDisconnect}
          isSaving={isSaving}
        />
      )}
    </div>
  </div>
);

const PayPalConnectForm = ({
  email,
  emailError,
  onEmailChange,
  onConnect,
  isSaving,
}) => (
  <>
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-700 text-lg font-medium">
          Connect your PayPal account
        </p>
        <p className="text-gray-500">Receive payments securely and instantly</p>
      </div>
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-700">Secure payments</span>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-indigo-700">Instant transfers</span>
        </div>
      </div>
    </div>

    <div className="my-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          id="paypalEmail"
          value={email}
          onChange={onEmailChange}
          placeholder="Enter your PayPal email"
          className={`w-full pl-10 pr-10 py-3 border ${
            emailError ? "border-red-300" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white`}
        />
        {email && !emailError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        )}
      </div>
      {emailError && (
        <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span>{emailError}</span>
        </p>
      )}
    </div>

    <button
      onClick={onConnect}
      disabled={!email || !!emailError || isSaving}
      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-full shadow-emerald-300 shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {!isSaving && <CheckCircle2 className="h-5 w-5" />}
      <span>{isSaving ? <Spinner /> : "CONNECT PAYPAL"}</span>
    </button>
  </>
);

const PayPalConnectedView = ({
  email,
  isEditing,
  tempEmail,
  emailError,
  onStartEditing,
  onEmailChange,
  onUpdateEmail,
  onCancelEditing,
  onDisconnect,
  isSaving,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
      <div className="text-left">
        <p className="text-emerald-800 font-semibold">
          PayPal Account Connected
        </p>
        <p className="text-emerald-600 text-sm">
          Your account is ready to receive payments
        </p>
      </div>
    </div>

    {!isEditing ? (
      <div className="flex items-center justify-center gap-2">
        <p className="text-emerald-700 text-lg flex items-center justify-center gap-1 font-bold">
          <Mail />
          {email}
        </p>
        <button
          onClick={onStartEditing}
          className="text-rose-600 hover:text-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          <Pencil />
        </button>
      </div>
    ) : (
      <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Update PayPal Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={tempEmail}
              onChange={onEmailChange}
              placeholder="Enter new PayPal email"
              disabled={isSaving}
              className={`w-full px-4 py-3 border ${
                emailError ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10 bg-white shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
            {tempEmail && !emailError && !isSaving && (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
            )}
            {isSaving && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {emailError && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{emailError}</span>
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onUpdateEmail}
            disabled={isSaving || !!emailError}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-emerald-300 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isSaving && <CheckCircle2 className="h-4 w-4" />}
            <span>{isSaving ? <Spinner /> : "Save Changes"}</span>
          </button>
          <button
            onClick={onCancelEditing}
            disabled={isSaving}
            className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    )}

    {!isEditing && (
      <button
        onClick={onDisconnect}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3.5 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-colors shadow-rose-300 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isSaving && <X className="h-5 w-5" />}
        <span>{isSaving ? <Spinner /> : "DISCONNECT PAYPAL"}</span>
      </button>
    )}
  </div>
);

function PaymentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("transactions");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isPaypalConnected, setIsPaypalConnected] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [stats, setStats] = useState({
    paidOrders: 0,
    unpaidOrders: 0,
    totalOrders: 0,
    totalReceived: 0,
    pendingAmount: 0,
    totalPayment: 0,
  });

  const validatePaypalEmail = useCallback((email) => {
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    return "";
  }, []);

  const fetchVendorOrders = async (vendorId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&filters[orderStatus][$eq]=delivered&fields[0]=createdAt&fields[1]=vendorDeliveryFee&fields[2]=subtotal&fields[3]=vendor_payment&fields[4]=customerOrderId&sort[0]=createdAt:desc`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch orders");
      }

      // Transform the data to match our transaction format
      const transformedOrders = data.data.map(order => ({
        orderId: order.customerOrderId,
        createdAt: order.createdAt,
        vendorPaymentStatus: order.vendor_payment.toUpperCase(),
        subtotal: parseFloat(order.subtotal),
        vendorDeliveryFee: parseFloat(order.vendorDeliveryFee),
      }));

      setTransactions(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");
    if (!jwt || !user) {
      toast.error(
        "You must be logged in to access payment settings. Please log in."
      );
      router.push("/login");
      return;
    }
    fetchVendorData(user);
  }, [router]);

  const fetchVendorData = async (email) => {
    try {
      setIsLoading(true);
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&fields[0]=id&fields[1]=paypalEmail`,
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
      const vendorData = data.data[0];
      if (!vendorData) {
        toast.info(
          "Please complete your vendor registration to access payment settings."
        );
        router.push("/become-vendor");
        return;
      }
      setVendorId(vendorData.documentId);
      if (vendorData.paypalEmail) {
        setPaypalEmail(vendorData.paypalEmail);
        setIsPaypalConnected(true);
      }
      // Fetch orders after getting vendor ID
      await fetchVendorOrders(vendorData.documentId);
    } catch (error) {
      toast.error(error.message || "Failed to load vendor information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const paidOrders = transactions.filter(
      (t) => t.vendorPaymentStatus === "PAID"
    ).length;
    const unpaidOrders = transactions.filter(
      (t) => t.vendorPaymentStatus === "UNPAID"
    ).length;
    const totalOrders = transactions.length;

    const totalReceived = transactions
      .filter((t) => t.vendorPaymentStatus === "PAID")
      .reduce((sum, t) => sum + t.subtotal + t.vendorDeliveryFee, 0);

    const pendingAmount = transactions
      .filter((t) => t.vendorPaymentStatus === "UNPAID")
      .reduce((sum, t) => sum + t.subtotal + t.vendorDeliveryFee, 0);

    const totalPayment = totalReceived + pendingAmount;

    setStats({
      paidOrders,
      unpaidOrders,
      totalOrders,
      totalReceived,
      pendingAmount,
      totalPayment,
    });
  }, [transactions]);

  const handleEmailChange = useCallback(
    (e) => {
      const newEmail = e.target.value.trim();
      if (isEditingEmail) {
        setTempEmail(newEmail);
      } else {
        setPaypalEmail(newEmail);
      }
      setEmailError(validatePaypalEmail(newEmail));
    },
    [isEditingEmail, validatePaypalEmail]
  );

  const handleConnectPaypal = useCallback(async () => {
    const error = validatePaypalEmail(paypalEmail);
    if (!error) {
      try {
        setIsSaving(true);
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
                paypalEmail,
              },
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to update PayPal email"
          );
        }

        setIsPaypalConnected(true);
        setEmailError("");
        toast.success("PayPal email connected successfully");
      } catch (error) {
        console.error("Error updating PayPal email:", error);
        setEmailError("Failed to connect PayPal. Please try again.");
        toast.error(error.message || "Failed to connect PayPal");
      } finally {
        setIsSaving(false);
      }
    } else {
      setEmailError(error);
    }
  }, [paypalEmail, validatePaypalEmail, vendorId]);

  const handleUpdateEmail = useCallback(async () => {
    const error = validatePaypalEmail(tempEmail);
    if (!error) {
      try {
        setIsSaving(true);
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
                paypalEmail: tempEmail,
              },
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to update PayPal email"
          );
        }

        setPaypalEmail(tempEmail);
        setIsEditingEmail(false);
        setEmailError("");
        toast.success("PayPal email updated successfully");
      } catch (error) {
        console.error("Error updating PayPal email:", error);
        setEmailError("Failed to update PayPal email. Please try again.");
        toast.error(error.message || "Failed to update PayPal email");
      } finally {
        setIsSaving(false);
      }
    } else {
      setEmailError(error);
    }
  }, [tempEmail, validatePaypalEmail, vendorId]);

  const handleDisconnectPaypal = useCallback(async () => {
    try {
      setIsSaving(true);
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
              paypalEmail: null,
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to disconnect PayPal");
      }

      setIsPaypalConnected(false);
      setPaypalEmail("");
      setEmailError("");
      toast.success("PayPal disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting PayPal:", error);
      setEmailError("Failed to disconnect PayPal. Please try again.");
      toast.error(error.message || "Failed to disconnect PayPal");
    } finally {
      setIsSaving(false);
    }
  }, [vendorId]);

  const startEditingEmail = useCallback(() => {
    setTempEmail(paypalEmail);
    setIsEditingEmail(true);
    setEmailError("");
  }, [paypalEmail]);

  const cancelEditing = useCallback(() => {
    setIsEditingEmail(false);
    setEmailError("");
    setTempEmail("");
  }, []);

  return (
    <div className="mx-auto p-4 pl-20 md:w-[80%]">
      <div className="border-b border-gray-300 mb-6 grid grid-cols-2">
        <button
          className={`py-3 px-6 text-lg focus:outline-none transition-colors duration-300 border-b-2 ${
            activeTab === "transactions"
              ? "border-red-600 text-red-600 font-semibold"
              : "text-gray-600 hover:text-red-600"
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={`py-3 px-6 text-lg focus:outline-none transition-colors duration-300 border-b-2 ${
            activeTab === "paymentMethods"
              ? "border-red-600 text-red-600 font-semibold"
              : "text-gray-600 hover:text-red-600"
          }`}
          onClick={() => setActiveTab("paymentMethods")}
        >
          Payment Methods
        </button>
      </div>

      <div>
        {activeTab === "transactions" && (
          <div>
            <TransactionStats stats={stats} />
            <h3 className="text-xl font-semibold mb-4">PAYMENT TRANSACTIONS</h3>
            <TransactionList transactions={transactions} />
          </div>
        )}

        {activeTab === "paymentMethods" && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">PAYMENT METHOD</h3>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <PayPalConnection
                  isConnected={isPaypalConnected}
                  email={paypalEmail}
                  emailError={emailError}
                  isEditing={isEditingEmail}
                  tempEmail={tempEmail}
                  onConnect={handleConnectPaypal}
                  onDisconnect={handleDisconnectPaypal}
                  onEmailChange={handleEmailChange}
                  onStartEditing={startEditingEmail}
                  onUpdateEmail={handleUpdateEmail}
                  onCancelEditing={cancelEditing}
                  isSaving={isSaving}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
