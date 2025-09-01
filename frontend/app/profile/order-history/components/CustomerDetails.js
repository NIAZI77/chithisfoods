import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Clock as ClockIcon,
  FileText,
  Store,
  Building2,
} from "lucide-react";
import DeliveryTypeBadge from "@/components/DeliveryTypeBadge";

function CustomerDetails({ order }) {
  return (
    <div className="flex-1 min-w-0 max-w-full md:min-w-[300px] md:max-w-[400px]">
      <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-700 flex items-center gap-2">
        <User className="w-4 h-4" />
        Order Information
      </h3>
      <div className="space-y-3 md:space-y-4">
        {/* Vendor Information - Compact & Clean */}
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
                <Store className="w-4 h-4 text-rose-600" />
                <p className="text-rose-600 text-xs font-medium">Vendor</p>
              </div>
              <p className="text-sm text-gray-800 font-semibold mb-0.5">
                {order.vendorName || "Unknown Vendor"}
              </p>
              {order.vendorUsername && (
                <p className="text-xs text-gray-500 mb-2">
                  @{order.vendorUsername}
                </p>
              )}
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

        {order.customerName && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Customer Name</p>
              <p className="text-xs text-gray-800 font-medium">
                {order.customerName}
              </p>
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
        {order.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Delivery Address</p>
              <p className="text-xs text-gray-800 font-medium">
                {order.address}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 md:gap-3">
          {order.paymentStatus && (
            <div className="flex-1 flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Payment Status</p>
                <p className="text-xs text-gray-800 font-medium capitalize">
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          )}
          {order.deliveryType && (
            <div className="flex-1 flex items-start gap-2">
              <Truck className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Order Type</p>
                <div className="mt-1">
                  <DeliveryTypeBadge
                    deliveryType={order.deliveryType}
                    variant="soft"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {order.createdAt && (
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
        )}
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
            {order.deliveryTime && (
              <div className="flex-1 flex items-start gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Delivery Time</p>
                  <p className="text-xs text-gray-800 font-medium">
                    {new Date(
                      `2000-01-01T${order.deliveryTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {order.note && order.note.trim() !== "" && (
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
  );
}

export default CustomerDetails;
