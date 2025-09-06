import { CheckCircle, X, AlertTriangle, Settings } from "lucide-react";
import Spinner from "@/components/WhiteSpinner";
import Link from "next/link";

function OrderActions({ order, loadingStates, onCancelOrder, userData }) {
  try {
    // Add safety check for order
    if (!order) {
      console.warn("OrderActions: order prop is undefined");
      return null;
    }

    const canCancel = order.orderStatus === "pending";
    const hasRefundDetails =
      userData?.refundDetails?.provider && userData?.refundDetails?.accountId;

    return (
      <div className="flex flex-col gap-4 p-3 border-t border-gray-100">
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>{/* Additional information can go here */}</div>

          <div className="flex gap-2">
            {canCancel && (
              <div className="flex flex-col justify-end gap-2">
                {!hasRefundDetails && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Add refund details to cancel orders</span>
                    <Link
                      href="/profile/settings"
                      className="ml-auto py-2 px-6 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-full transition-all font-medium flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Settings
                    </Link>
                  </div>
                )}
                <div className="flex justify-end">
                <button
                  onClick={onCancelOrder}
                  disabled={loadingStates.cancel || !hasRefundDetails}
                  className={`py-2 px-6 text-sm rounded-full transition-all font-semibold flex items-center w-fit gap-2 ${
                    hasRefundDetails
                      ? "bg-red-600 text-white shadow-red-300 shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  type="button"
                  title={
                    hasRefundDetails
                      ? "Cancel this order"
                      : "Add refund details in settings to cancel orders"
                  }
                >
                  {loadingStates.cancel ? (
                    <Spinner />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Cancel Order
                </button>
                </div>
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
