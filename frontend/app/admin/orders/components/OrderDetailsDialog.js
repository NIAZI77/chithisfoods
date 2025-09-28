import DeliveryTypeBadge from "@/components/DeliveryTypeBadge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Store,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

function OrderDetailsDialog({ order, isOpen, onClose }) {
  if (!order) return null;

  const items = order.dishes || order.items || [];
  const deliveryFee = Number(order.deliveryFee || 0);
  const subtotal = Number(order.subtotal || 0);
  const tax = Number(order.tax || 0);
  const total = Number(
    order.totalAmount !== undefined && order.totalAmount !== null
      ? order.totalAmount
      : subtotal + deliveryFee + tax
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-full w-[95vw] md:max-w-[900px] md:w-full p-0 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <AlertDialogTitle className="text-lg md:text-2xl font-semibold">
            Order Details
          </AlertDialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold "
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
              {order.customerName && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Customer Name</p>
                    <p className="text-xs text-gray-800 font-medium">{order.customerName}</p>
                  </div>
                </div>
              )}
              {order.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Phone Number</p>
                    <p className="text-xs text-gray-800 font-medium">{order.phone}</p>
                  </div>
                </div>
              )}
              {order.deliveryType !== "pickup" && order.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Delivery Address</p>
                    <p className="text-xs text-gray-800 font-medium">{order.address || "-"}</p>
                  </div>
                </div>
              )}
              <div className="bg-gradient-to-r from-rose-50 to-rose-50 rounded-lg p-3 border border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={order.vendorAvatar || "/fallback.png"}
                      alt={order.vendorName || "Vendor"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/fallback.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="h-full w-fit text-rose-600" />
                      <div>
                        <p className="text-sm text-rose-600 font-semibold">
                          {order.vendorName || "Unknown Vendor"}
                        </p>
                        {order.vendorUsername && (
                          <Link href={`/vendors/@${order.vendorUsername}`} className="text-xs text-gray-500 hover:underline block">
                            @{order.vendorUsername}
                          </Link>
                        )}

                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Address - Inline compact design */}
                {order.vendorAddress && (
                  <div className="mt-2 flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-rose-200">
                    <Building2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-rose-600 font-medium">
                          {order.deliveryType === "pickup"
                            ? "Pickup Location"
                            : "Vendor Location"}
                        </span>
                        {order.deliveryType === "pickup" && (
                          <DeliveryTypeBadge deliveryType="pickup" variant="soft" />
                        )}
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-tight break-words">
                        {order.vendorAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(order.paymentStatus || order.deliveryType) && (
                <div className="flex gap-2 md:gap-3">
                  {order.paymentStatus && (
                    <div className="flex-1 flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">Payment Status</p>
                        <p className="text-xs text-gray-800 font-medium capitalize">{order.paymentStatus}</p>
                      </div>
                    </div>
                  )}
                  {order.deliveryType && (
                    <div className="flex-1 flex items-start gap-2">
                      <Truck className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">Order Type</p>
                        <div className="mt-1">
                          <DeliveryTypeBadge deliveryType={order.deliveryType} variant="soft" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {order.createdAt && (
                <div className="flex gap-2 md:gap-3">
                  <div className="flex-1 flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Order Date</p>
                      <p className="text-xs text-gray-800 font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-start gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Order Time</p>
                      <p className="text-xs text-gray-800 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                </div>
              )}
              {order.deliveryDate && (
                <div className="flex gap-2 md:gap-3">
                  <div className="flex-1 flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Delivery Date</p>
                      <p className="text-xs text-gray-800 font-medium">{formatDate(order.deliveryDate)}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-start gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Delivery Time</p>
                      <p className="text-xs text-gray-800 font-medium">{new Date(`2000-01-01T${order.deliveryTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                </div>
              )}
              {order.note && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Order Note</p>
                    <p className="text-xs text-gray-800 font-medium">{order.note}</p>
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
              {items.map((dish, idx) => {
                const validToppings = (dish.toppings || []).filter(
                  (t) => t && t.name && t.price !== undefined && t.price !== null && !isNaN(Number(t.price))
                );
                const validExtras = (dish.extras || []).filter(
                  (e) => e && e.name && e.price !== undefined && e.price !== null && !isNaN(Number(e.price))
                );

                return (
                  <div key={idx} className="flex items-start gap-3 md:gap-4 bg-gray-50 border border-gray-100 rounded-lg p-2 md:p-3">
                    <div className="w-16 md:w-20 relative rounded overflow-hidden flex-shrink-0 aspect-video">
                      <img src={dish.image?.url || "/food.png"} alt={dish.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-gray-800">{dish.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Quantity: {dish.quantity}</div>
                      {(validToppings.length > 0 || validExtras.length > 0) && (
                        <div className="space-x-2 space-y-1 pt-2 border-t border-gray-100 flex items-start flex-col">
                          {validToppings.length > 0 && (
                            <div>
                              <div className="flex flex-wrap gap-1">
                                {validToppings.map((topping, i) => (
                                  <span key={i} className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-xs">
                                    <img src={"/toppings.png"} alt="Topping" className="w-3 h-3 scale-175" /> {topping.name} (${Number(topping.price).toFixed(2)})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {validExtras.length > 0 && (
                            <div>
                              <div className="flex flex-wrap gap-1">
                                {validExtras.map((extra, i) => (
                                  <span key={i} className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-xs">
                                    <img src={"/extras.png"} alt="Extra" className="w-3 h-3 scale-125" /> {extra.name} (${Number(extra.price).toFixed(2)})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-orange-600">${parseFloat(dish.total).toFixed(2)}</div>
                      {dish.selectedSpiciness && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-gray-700">{dish.selectedSpiciness}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  Total Items:
                </span>
                <span className="text-xs font-semibold text-gray-900">{items.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Subtotal
                </span>
                <span className="text-xs font-semibold text-orange-600">${subtotal.toFixed(2)}</span>
              </div>
              {order.deliveryType === "delivery" && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Delivery Fee
                  </span>
                  <span className="text-xs font-semibold text-orange-600">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Tax
                </span>
                <span className="text-xs font-semibold text-orange-600">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Sigma className="w-3 h-3" />
                  Total
                </span>
                <span className="text-xs font-semibold text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end p-3 gap-4 border-t border-gray-100">
          <AlertDialogCancel className="px-6 py-2 text-sm text-gray-600 rounded-full border-2 border-gray-600 hover:bg-gray-600 hover:text-white transition-all font-medium">
            Close
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OrderDetailsDialog;


