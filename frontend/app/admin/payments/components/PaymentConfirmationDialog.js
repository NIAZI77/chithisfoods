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
import { AlertTriangle, CircleDollarSign, RotateCcw } from "lucide-react";
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${order.vendorId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }

        const data = await response.json();
        setVendorData(data.data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
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
  const title = isPayment ? "Process Vendor Payment" : "Process Refund";
  const description = isPayment
    ? "This will mark the vendor payment as paid. This action cannot be reversed."
    : "This will mark the order as refunded. This action cannot be reversed.";
  const confirmText = isPayment ? "Mark as Paid" : "Mark as Refunded";
  const confirmColor = isPayment ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600";

  if (!order) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600 mt-2">
            {description}
          </AlertDialogDescription>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Order ID</span> {order.documentId}</p>
            <p><span className="font-medium">Amount</span> ${isPayment ? Number(order.subtotal?.toFixed(2)) + Number(order.deliveryFee?.toFixed(2)) : order.totalAmount?.toFixed(2)}</p>
            <p><span className="font-medium">Vendor</span> @{order.vendorUsername || "N/A"}</p>
            <p><span className="font-medium">Order Status</span> {order.orderStatus}</p>
            <p><span className="font-medium">Payment Status</span> {order.paymentStatus}</p>
            <p><span className="font-bold">Vendor Payment</span> {order.vendor_payment}</p>
            {type === "payment" ? (
              <p>
                <span className="font-medium">Vendor PayPal Email</span>{" "}
                {loadingVendor ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  vendorData?.paypalEmail || "N/A"
                )}
              </p>
            ) : (
              <p><span className="font-medium">Refund Email</span> {order.refundEmail || "N/A"}</p>
            )}
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing || (type === "payment" && loadingVendor)}
            className={`${confirmColor} text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2`}
          >
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPayment ? (
              <CircleDollarSign className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            {isProcessing ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentConfirmationDialog; 