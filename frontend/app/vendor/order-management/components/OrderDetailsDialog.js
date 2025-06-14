import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Clock as ClockIcon,
  FileText,
  ShoppingBag,
  DollarSign,
  Flame,
  Sigma,
  Salad,
} from "lucide-react";
import { PiBowlFood } from "react-icons/pi";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Spinner from "@/app/components/Spinner";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BadgePercent } from "lucide-react";

const ORDER_STATUS = {
  PENDING: "pending",
  IN_PROCESS: "in-process",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const TOAST_MESSAGES = {
  ORDER_UPDATE_SUCCESS: "Order status updated successfully.",
  ORDER_UPDATE_ERROR: "Failed to update order status.",
  CANCEL_NOT_ALLOWED: "Cannot cancel an order that is ready for delivery.",
};

function OrderDetailsDialog({ order, isOpen, onClose }) {
  const [loadingStates, setLoadingStates] = useState({
    processing: false,
    ready: false,
    cancel: false,
  });

  if (!order) return null;

  const handleStatusUpdate = async (newStatus) => {
    if (
      order.orderStatus === ORDER_STATUS.READY &&
      newStatus === ORDER_STATUS.CANCELLED
    ) {
      toast.error(TOAST_MESSAGES.CANCEL_NOT_ALLOWED);
      return;
    }

    const loadingKey =
      newStatus === ORDER_STATUS.IN_PROCESS
        ? "processing"
        : newStatus === ORDER_STATUS.READY
          ? "ready"
          : "cancel";

    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${order.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              orderStatus: newStatus,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(TOAST_MESSAGES.ORDER_UPDATE_ERROR);
      }

      toast.success(TOAST_MESSAGES.ORDER_UPDATE_SUCCESS);
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(TOAST_MESSAGES.ORDER_UPDATE_ERROR);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-full w-[95vw] md:max-w-[900px] md:w-full p-0 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <AlertDialogTitle className="text-lg md:text-2xl font-semibold">
            Order Details
          </AlertDialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row p-4 gap-2">
          <div className="flex-1 min-w-0 max-w-full md:min-w-[300px] md:max-w-[400px]">
            <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-700 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Customer Details
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Customer Name</p>
                  <p className="text-xs text-gray-800 font-medium">
                    {order.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Phone Number</p>
                  <p className="text-xs text-gray-800 font-medium">
                    {order.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Delivery Address
                  </p>
                  <p className="text-xs text-gray-800 font-medium">
                    {order.address}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">
                      Payment Status
                    </p>
                    <p className="text-xs text-gray-800 font-medium capitalize">
                      {order.paymentStatus || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Order Type</p>
                    <p className="text-xs text-gray-800 font-medium capitalize">
                      {order.deliveryType || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Order Date</p>
                    <p className="text-xs text-gray-800 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Order Time</p>
                    <p className="text-xs text-gray-800 font-medium">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              {order.deliveryDate && (
                <div className="flex gap-2 md:gap-3">
                  <div className="flex-1 flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Delivery Date</p>
                      <p className="text-xs text-gray-800 font-medium">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-start gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Delivery Time</p>
                      <p className="text-xs text-gray-800 font-medium">
                        {new Date(`2000-01-01T${order.deliveryTime}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {order.note && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Order Note</p>
                    <p className="text-xs text-gray-800 font-medium">
                      {order.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 max-w-full">
            <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-700 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Items
            </h3>
            <div className="space-y-2 md:space-y-3 max-h-[220px] md:max-h-[340px] overflow-y-auto pr-1">
              {order.dishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 md:gap-4 bg-gray-50 border border-gray-100 rounded-lg p-2 md:p-3"
                >
                  <div className="w-16 md:w-20 relative rounded overflow-hidden flex-shrink-0 aspect-video">
                    <Image
                      src={dish.image?.url || "/food.png"}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-800">
                      {dish.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Quantity: {dish.quantity}
                    </div>
                   
                    {(dish.toppings?.length > 0 || dish.extras?.length > 0) && (
                      <div className="space-x-2 space-y-1 pt-2 border-t border-gray-100 flex items-start flex-col">
                        {dish.toppings?.length > 0 && (
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {dish.toppings.map((topping, idx) => (
                                <span
                                  key={idx}
                                  className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-xs"
                                >
                                  <Image src={"/toppings.png"} alt="Topping" width={14} height={14} className="w-3 h-3 scale-175" /> {topping.name} (${topping.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {dish.extras?.length > 0 && (
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {dish.extras.map((extra, idx) => (
                                <span
                                  key={idx}
                                  className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-xs"
                                >
                                  <Image src={"/extras.png"} alt="Extra" width={14} height={14} className="w-3 h-3 scale-125" /> {extra.name} (${extra.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-orange-600">
                      ${parseFloat(dish.total).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5"> {dish.selectedSpiciness && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-gray-700">
                          {dish.selectedSpiciness}
                        </span>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  Total Items:
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {order.dishes.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Subtotal
                </span>
                <span className="text-xs font-semibold text-orange-600">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Delivery Fee
                </span>
                <span className="text-xs font-semibold text-orange-600">
                  ${order.vendorDeliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Sigma className="w-3 h-3" />
                  Total
                </span>
                <span className="text-xs font-semibold text-orange-600">
                  ${(order.subtotal + order.vendorDeliveryFee).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end p-3 gap-4 border-t border-gray-100">
          <AlertDialogCancel className="px-6 py-1.5 text-sm border-orange-500 text-orange-500 hover:text-orange-600 rounded-md transition-colors hover:border-orange-600 font-semibold">
            Close
          </AlertDialogCancel>
          {order.orderStatus === "pending" && (
            <button
              onClick={() => handleStatusUpdate("in-process")}
              disabled={
                loadingStates.processing ||
                loadingStates.ready ||
                loadingStates.cancel
              }
              className="px-6 py-1.5 text-sm bg-indigo-600 text-white rounded-md transition-colors hover:bg-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {loadingStates.processing ? <Spinner /> : "Mark as Processing"}
            </button>
          )}
          {order.orderStatus === "in-process" && (
            <button
              onClick={() => handleStatusUpdate("ready")}
              disabled={
                loadingStates.processing ||
                loadingStates.ready ||
                loadingStates.cancel
              }
              className="px-6 py-1.5 text-sm bg-green-500 text-white rounded-md transition-colors hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {loadingStates.ready ? <Spinner /> : "Mark as Ready"}
            </button>
          )}
          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "ready" && (
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={
                  loadingStates.processing ||
                  loadingStates.ready ||
                  loadingStates.cancel
                }
                className="px-6 py-1.5 text-sm bg-red-500 text-white rounded-md transition-colors hover:bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {loadingStates.cancel ? <Spinner /> : "Cancel Order"}
              </button>
            )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OrderDetailsDialog;
