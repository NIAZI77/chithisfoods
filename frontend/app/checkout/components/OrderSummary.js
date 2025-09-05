import React from "react";
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
    <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 h-fit flex flex-col min-w-[320px] order-last md:order-none md:sticky md:top-20">
      <h3 className="font-black text-2xl mb-6 flex items-center gap-2 text-rose-600">
        <Receipt className="w-6 h-6" />
        Order Summary
      </h3>

      <div className="rounded-xl p-6">
        <div className="flex justify-between text-base font-bold mb-2">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Subtotal
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-base font-bold mb-2">
          <span className="flex items-center gap-2">
            <HiOutlineReceiptTax />
            Tax
          </span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {deliveryMode !== "pickup" && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Delivery Fees by Vendor
            </div>
            <div className="space-y-2">
              {deliveryFees.map((fee) => (
                <div
                  key={fee.vendorId}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                    {fee.storeName}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${fee.vendorDeliveryFee.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveryMode !== "pickup" && (
          <div className="flex justify-between text-base font-bold mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Total Delivery
            </span>
            <span>${totalDeliveryFee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-black mt-2">
          <span className="flex items-center gap-2">
            <LuSquareSigma className="w-5 h-5" />
            Total
          </span>
          <span className="text-rose-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={submitting || !canPlaceOrder}
        className="w-full bg-rose-600 text-white py-2.5 md:py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
      >
        {!submitting ? <Lock className="w-5 h-5" /> : ""}
        {submitting ? <Spinner /> : "PLACE ORDER"}
      </button>

      <div className="text-xs text-center text-gray-500 mt-4">
        By placing your order you agree to the{" "}
        <a href="/privacy-policy" className="underline text-rose-600">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms-and-conditions" className="underline text-rose-600">
          Terms & Conditions
        </a>
      </div>
    </div>
  );
};

export default OrderSummary;
