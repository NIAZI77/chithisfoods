import { CheckCircle, X, AlertTriangle, Settings } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import Link from "next/link";

function OrderActions({ 
  order, 
  loadingStates, 
  onMarkAsReceived, 
  onCancelOrder,
  userData
}) {
  try {
    // Add safety check for order
    if (!order) {
      console.warn("OrderActions: order prop is undefined");
      return null;
    }

    const canCancel = order.orderStatus === "pending";
    const hasRefundDetails = userData?.refundDetails?.provider && userData?.refundDetails?.accountId;

    return (
      <div className="flex flex-col gap-4 p-3 border-t border-gray-100">
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            {/* Additional information can go here */}
          </div>
          
          <div className="flex gap-2">
            {order.orderStatus === "ready" && (
              <button
                onClick={onMarkAsReceived}
                disabled={loadingStates.received}
                className="px-6 py-1.5 text-sm bg-green-500 text-white rounded-md transition-colors hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                type="button"
              >
                {loadingStates.received ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                Mark as Received
              </button>
            )}
            
            {canCancel && (
              <div className="flex flex-col gap-2">
                {!hasRefundDetails && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Add refund details to cancel orders</span>
                    <Link
                      href="/profile/settings"
                      className="ml-auto px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Settings
                    </Link>
                  </div>
                )}
                
                <button
                  onClick={onCancelOrder}
                  disabled={loadingStates.cancel || !hasRefundDetails}
                  className={`px-6 py-1.5 text-sm rounded-md transition-colors font-semibold flex items-center gap-2 ${
                    hasRefundDetails
                      ? "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  type="button"
                  title={hasRefundDetails ? "Cancel this order" : "Add refund details in settings to cancel orders"}
                >
                  {loadingStates.cancel ? <Spinner /> : <X className="w-4 h-4" />}
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in OrderActions component:", error);
    return (
      <div className="p-3 text-red-600 border-t border-gray-100">
        Error loading order actions. Please try refreshing the page.
      </div>
    );
  }
}

export default OrderActions;
