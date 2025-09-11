import React from "react";
import Link from "next/link";
import { Receipt, ShoppingCart, Truck, Lock } from "lucide-react";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import Spinner from "@/components/WhiteSpinner";
import { toast } from "react-toastify";

const OrderSummary = ({
  subtotal,
  tax,
  deliveryFees,
  totalDeliveryFee,
  total,
  submitting,
  onSubmit,
  deliveryMode,
  canPlaceOrder = false,
}) => {
  return (
    <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 h-fit flex flex-col min-w-[280px] sm:min-w-[320px] md:min-w-[320px] order-last md:order-none md:sticky md:top-20">
      <h3 className="font-black text-xl sm:text-2xl md:text-2xl mb-4 sm:mb-6 md:mb-6 flex items-center gap-2 text-rose-600">
        <Receipt className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
        Order Summary
      </h3>

      <div className="rounded-xl p-4 sm:p-6 md:p-6">
        <div className="flex justify-between text-sm sm:text-base md:text-base font-bold mb-2">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Subtotal
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base md:text-base font-bold mb-2">
          <span className="flex items-center gap-2">
            <HiOutlineReceiptTax />
            Tax
          </span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {deliveryMode !== "pickup" && (
          <div className="mb-3 sm:mb-4 md:mb-4">
            <div className="text-xs sm:text-sm md:text-sm font-semibold text-gray-600 mb-2 sm:mb-3 md:mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Delivery Fees by Vendor
            </div>
            <div className="space-y-1 sm:space-y-2 md:space-y-2">
              {deliveryFees.map((fee) => (
                <div
                  key={fee.vendorId}
                  className="flex justify-between items-center py-1.5 sm:py-2 md:py-2 px-2 sm:px-3 md:px-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm md:text-sm font-medium text-gray-800">
                    <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                    <span className="truncate">{fee.storeName}</span>
                  </span>
                  <span className="text-xs sm:text-sm md:text-sm font-semibold text-gray-900">
                    ${fee.vendorDeliveryFee.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveryMode !== "pickup" && (
          <div className="flex justify-between text-sm sm:text-base md:text-base font-bold mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Total Delivery
            </span>
            <span>${totalDeliveryFee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-base sm:text-lg md:text-lg font-black mt-2">
          <span className="flex items-center gap-2">
            <LuSquareSigma className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
            Total
          </span>
          <span className="text-rose-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={submitting || !canPlaceOrder}
        className="w-full bg-rose-600 text-white py-2.5 sm:py-3 md:py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm sm:text-base md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
      >
        {!submitting ? <Lock className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> : ""}
        {submitting ? <Spinner /> : "PLACE ORDER"}
      </button>

      <div className="text-xs text-center text-gray-500 mt-3 sm:mt-4 md:mt-4">
        By placing your order you agree to the{" "}
        <Link href="/privacy-policy" className="underline text-rose-600">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-and-conditions" className="underline text-rose-600">
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
