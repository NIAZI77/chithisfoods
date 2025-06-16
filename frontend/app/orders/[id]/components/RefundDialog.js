import { X } from "lucide-react";
import { FaPaypal } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "@/app/orders/[id]/components/dialog";
import Spinner from "@/app/components/Spinner";

const RefundDialog = ({
  isOpen,
  onOpenChange,
  refundEmail,
  setRefundEmail,
  isUpdatingRefund,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-[85%] md:w-[500px] max-h-[90vh] overflow-y-auto bg-white mx-auto">
        <DialogHeader className="space-y-2 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-2.5">
              <FaPaypal className="w-6 h-6 text-[#0070ba]" />
              PayPal Refund Email
            </DialogTitle>
            <DialogPrimitive.Close className="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </DialogPrimitive.Close>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              PayPal Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={refundEmail}
                onChange={(e) => setRefundEmail(e.target.value)}
                placeholder="Enter your PayPal email address"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070ba] bg-gray-50 pr-10"
                disabled={isUpdatingRefund}
              />
              {refundEmail && (
                <button
                  onClick={() => setRefundEmail("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              This should be the email address associated with your PayPal account
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-2 sticky bottom-0 bg-white border-t">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
            disabled={isUpdatingRefund}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isUpdatingRefund || !refundEmail}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-[#0070ba] text-white rounded-lg sm:rounded-xl transition-colors hover:bg-[#005ea6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-2.5"
          >
            {isUpdatingRefund ? (
              <Spinner />
            ) : (
              <>
                <FaPaypal className="w-4 h-4" />
                Submit PayPal Email
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog; 