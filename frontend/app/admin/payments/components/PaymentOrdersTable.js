import { Check, X, Info, CircleDollarSign, RotateCcw } from "lucide-react";
import { FaHandHoldingUsd } from "react-icons/fa";
import Spinner from "@/components/BlackSpinner";
import {
  STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
  BUTTON_STYLES,
  ACTION_STATUS_STYLES,
} from "../constants";
import { useState, useEffect } from "react";

const PaymentOrdersTable = ({
  orders,
  processingPayments,
  processingRefunds,
  onProcessVendorPayment,
  onProcessRefund,
}) => {
  const [vendorPaypalEmails, setVendorPaypalEmails] = useState({});

  useEffect(() => {
    const fetchVendorPaypalEmails = async () => {
      const vendorIds = orders
        .filter(
          (order) =>
            order.orderStatus === "delivered" &&
            order.vendor_payment === "unpaid"
        )
        .map((order) => order.vendorId);

      const uniqueVendorIds = [...new Set(vendorIds)];

      for (const vendorId of uniqueVendorIds) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) continue;

          const data = await response.json();
          setVendorPaypalEmails((prev) => ({
            ...prev,
            [vendorId]: data.data?.paypalEmail || null,
          }));
        } catch (error) {
          console.error("Error fetching vendor PayPal email:", error);
        }
      }
    };

    fetchVendorPaypalEmails();
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <div className="text-gray-500 text-lg font-medium">
          No orders requiring payment processing
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Try adjusting your filters
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
      <div className="min-w-[800px] sm:min-w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Vendor
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Order Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Payment Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Vendor Payment
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Subtotal
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Delivery Fee
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Tax
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.documentId} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-left">
                  {order.customerName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-left">
                  @{order.vendorUsername}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full flex items-center justify-center w-24 text-center capitalize ${
                      STATUS_STYLES[order.orderStatus] || STATUS_STYLES.default
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full text-center flex items-center justify-center w-24 capitalize ${
                      PAYMENT_STATUS_STYLES[order.paymentStatus] ||
                      PAYMENT_STATUS_STYLES.default
                    }`}
                  >
                    {order.paymentStatus || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full text-center flex items-center justify-center w-24 capitalize ${
                      STATUS_STYLES[order.vendor_payment] ||
                      STATUS_STYLES.default
                    }`}
                  >
                    {order.vendor_payment}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                  ${order.subtotal?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                  ${order.deliveryFee?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                  ${order.tax?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3 text-sm text-center font-medium text-gray-900 whitespace-nowrap">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-center space-y-2 whitespace-nowrap">
                  <div className="flex flex-col gap-2 items-center">
                    {order.orderStatus === "delivered" &&
                      order.vendor_payment === "unpaid" && (
                        <button
                          onClick={() =>
                            onProcessVendorPayment(order.documentId)
                          }
                          disabled={
                            processingPayments[order.documentId] ||
                            !vendorPaypalEmails[order.vendorId]
                          }
                          className={`${BUTTON_STYLES.payVendor} ${
                            processingPayments[order.documentId] ||
                            !vendorPaypalEmails[order.vendorId]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            !vendorPaypalEmails[order.vendorId]
                              ? "Vendor PayPal email not provided"
                              : ""
                          }
                        >
                          {processingPayments[order.documentId] ? (
                            <span className="flex items-center justify-center gap-2">
                              <Spinner />
                            </span>
                          ) : (
                            <>
                              <FaHandHoldingUsd className="w-4 h-4" />
                              Pay Vendor
                            </>
                          )}
                        </button>
                      )}
                    {order.orderStatus === "cancelled" &&
                      order.paymentStatus !== "refunded" &&
                      order.vendor_payment !== "refunded" && (
                        <button
                          onClick={() => onProcessRefund(order.documentId)}
                          disabled={processingRefunds[order.documentId]}
                          className={`${BUTTON_STYLES.processRefund} ${
                            processingRefunds[order.documentId]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            !order.refundDetails?.email
                              ? "Click to view refund details (refund cannot be processed without customer details)"
                              : "Process refund for this order"
                          }
                        >
                          {processingRefunds[order.documentId] ? (
                            <span className="flex items-center justify-center gap-2">
                              <Spinner />
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-xs">
                              <CircleDollarSign className="w-4 h-4" />
                              Process Refund
                            </div>
                          )}
                        </button>
                      )}
                    {order.orderStatus === "cancelled" &&
                      order.paymentStatus !== "refunded" &&
                      order.vendor_payment !== "refunded" &&
                      !order.refundDetails?.email && (
                        <div className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <Info className="w-3 h-3" />
                          No refund details
                        </div>
                      )}
                    {!(
                      (order.orderStatus === "delivered" &&
                        order.vendor_payment === "unpaid") ||
                      (order.orderStatus === "cancelled" &&
                        order.paymentStatus !== "refunded" &&
                        order.vendor_payment !== "refunded")
                    ) && (
                      <span
                        className={`${
                          ACTION_STATUS_STYLES[
                            order.paymentStatus === "refunded" ||
                            order.vendor_payment === "refunded"
                              ? "refunded"
                              : order.vendor_payment === "paid"
                              ? "paid"
                              : "default"
                          ]
                        }`}
                      >
                        {order.paymentStatus === "refunded" ||
                        order.vendor_payment === "refunded" ? (
                          <>
                            <X className="w-4 h-4" />
                            Refunded
                          </>
                        ) : order.vendor_payment === "paid" ? (
                          <>
                            <Check className="w-4 h-4" />
                            Paid to Vendor
                          </>
                        ) : (
                          <>
                            <Info className="w-4 h-4" />
                            No Action Required
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentOrdersTable;
