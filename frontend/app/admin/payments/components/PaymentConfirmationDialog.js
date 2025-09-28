import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  CircleDollarSign,
  RotateCcw,
  Banknote,
  CreditCard,
  FileText,
  Store,
  Hash,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";

const PaymentConfirmationDialog = ({
  isOpen,
  onOpenChange,
  type,
  order,
  onConfirm,
  isProcessing,
}) => {
  const [vendorData, setVendorData] = useState(null);
  const [loadingVendor, setLoadingVendor] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!order?.vendorId || type !== "payment") return;

      try {
        setLoadingVendor(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${order.vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Gracefully handle non-OK responses without throwing to avoid noisy console overlays
          setVendorData(null);
          return;
        }

        const data = await response.json();
        setVendorData(data.data);
      } catch (error) {
        // Use warn instead of error to avoid dev overlay noise
        console.warn("Error fetching vendor data:", error);
      } finally {
        setLoadingVendor(false);
      }
    };

    if (isOpen && type === "payment") {
      fetchVendorData();
    } else {
      setVendorData(null);
    }
  }, [isOpen, order?.vendorId, type]);

  const isPayment = type === "payment";
  const title = isPayment ? "Process vendor payment" : "Process refund";
  const description = isPayment
    ? "Marks the vendor payment as paid. This cannot be undone."
    : "Marks the order as refunded. This cannot be undone.";
  const confirmText = isPayment ? "Mark as Paid" : "Mark as Refunded";
  const confirmColor = isPayment
    ? "bg-green-500 hover:bg-green-600"
    : "bg-red-500 hover:bg-red-600";

  // Check if refund details are available for refund type
  const hasRefundDetails = order?.refundDetails?.accountId;
  const isRefundDisabled = type === "refund" && !hasRefundDetails;
  // Check if vendor payment details exist for payment type
  const hasVendorPaymentDetails = !!vendorData?.vendorPaymentMethod?.accountId;
  const paymentMethod = vendorData?.vendorPaymentMethod || null;
  const provider = paymentMethod?.provider || "Unknown";
  const accountId = paymentMethod?.accountId || "";
  const maskedAccountId = accountId ? `•••• ${String(accountId).slice(-4)}` : "";
  const paymentAmount = isPayment
    ? Number(order?.subtotal || 0) + Number(order?.deliveryFee || 0)
    : Number(order?.totalAmount || 0);
  const additionalPaymentFields = paymentMethod
    ? Object.entries(paymentMethod)
      .filter(([key, value]) => !["provider", "accountId", "updatedAt"].includes(key) && value !== undefined && value !== null && `${value}`.trim() !== "")
    : [];
  const prettyLabel = (label) =>
    label
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  const isPaymentDisabled = type === "payment" && !loadingVendor && !hasVendorPaymentDetails;

  if (!order) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-full w-[95vw] md:max-w-[520px] p-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-start gap-3 bg-white flex-shrink-0">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isPayment ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
            {isPayment ? <Banknote className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <AlertDialogTitle className="text-base md:text-lg font-semibold text-gray-900">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 mt-1">
              {description}
            </AlertDialogDescription>
          </div>
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Hash className="h-4 w-4 text-gray-400" />
              <div className="truncate"><span className="text-gray-500">Order ID:</span> <span className="font-medium text-gray-900">{order.searchableOrderId}</span></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CircleDollarSign className={`h-4 w-4 ${isPayment ? "text-emerald-500" : "text-rose-500"}`} />
              <div>
                <span className="text-gray-500">Amount:</span> <span className={`${isPayment ? "text-emerald-700" : "text-rose-700"} font-semibold`}>
                  ${isPayment
                    ? (Number(order.subtotal || 0) + Number(order.deliveryFee || 0)).toFixed(2)
                    : Number(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Store className="h-4 w-4 text-gray-400" />
              <div className="truncate"><span className="text-gray-500">Vendor:</span> <span className="font-medium text-gray-900">{order.vendorName || order.vendorUsername || "N/A"}</span></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="h-4 w-4 text-gray-400" />
              <div className="truncate"><span className="text-gray-500">Order Status:</span> <span className="font-medium text-gray-900 capitalize">{order.orderStatus}</span></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div className="truncate"><span className="text-gray-500">Payment Status:</span> <span className="font-medium text-gray-900 capitalize">{order.paymentStatus}</span></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Banknote className="h-4 w-4 text-gray-400" />
              <div className="truncate"><span className="text-gray-500">Vendor Payment:</span> <span className="font-medium text-gray-900 capitalize">{order.vendor_payment}</span></div>
            </div>
            {type === "payment" ? (
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Vendor Payment Method</span>
                </div>
                {loadingVendor ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm px-3 py-2">Loading...</div>
                ) : hasVendorPaymentDetails ? (
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-900 capitalize">{provider.replace('_', ' ')}</span>
                    </div>

                    <div className="bg-emerald-50 rounded-md p-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                          Payment Amount
                        </span>
                        <span className="font-semibold text-emerald-700">${paymentAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Account ID:</span>
                        <span className="text-gray-800 font-mono text-[11px] break-all">{accountId}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Provider:</span>
                        <span className="text-gray-800 capitalize">{provider.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {additionalPaymentFields.length > 0 && (
                      <div className="pt-2 mt-1 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-500 mb-2">Additional Information</div>
                        <div className="space-y-1.5">
                          {additionalPaymentFields.map(([key, value]) => (
                            <div key={key} className="flex items-start justify-between rounded-md bg-gray-50 px-2.5 py-2">
                              <span className="text-[11px] text-gray-500 font-medium">{prettyLabel(key)}</span>
                              <span className="text-xs text-gray-800 font-medium text-right max-w-[180px] break-words">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-3 py-2.5 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <span>Vendor payment details missing. Add details to enable payment.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Customer Refund Details</span>
                </div>
                {hasRefundDetails ? (
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 flex flex-col gap-3">
                    <div className="bg-rose-50 rounded-md p-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <CircleDollarSign className="h-4 w-4 text-rose-600" />
                          Refund Amount
                        </span>
                        <span className="font-semibold text-rose-700">${Number(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Account ID:</span>
                        <span className="text-gray-800 font-mono text-[11px] break-all">{order.refundDetails.accountId}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Provider:</span>
                        <span className="text-gray-800 capitalize">{order.refundDetails.provider?.replace('_', ' ') || 'Unknown'}</span>
                      </div>
                    </div>

                    {order.refundDetails.additionalInfo && (
                      <div className="pt-2 mt-1 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-500 mb-1">Additional Information</div>
                        <div className="rounded-md bg-gray-50 px-2.5 py-2">
                          <span className="text-xs text-gray-800">{order.refundDetails.additionalInfo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-3 py-2.5 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <span>Customer refund details missing. Add details to enable refund.</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 flex-shrink-0">
          <AlertDialogCancel className="mt-0 h-9 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={
              isProcessing ||
              (type === "payment" && (loadingVendor || isPaymentDisabled)) ||
              isRefundDisabled
            }
            className={`${confirmColor} h-9 px-3 rounded-lg text-white transition-colors flex items-center gap-2 ${isRefundDisabled || (type === "payment" && (loadingVendor || isPaymentDisabled)) ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
            ) : isPayment ? (
              <CircleDollarSign className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            {isProcessing ? "Processing..." : confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentConfirmationDialog;
