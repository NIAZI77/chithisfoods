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
} from "lucide-react";

function CustomerDetails({ order }) {
  return (
    <div className="flex-1 min-w-0 max-w-full md:min-w-[300px] md:max-w-[400px]">
      <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-700 flex items-center gap-2">
        <User className="w-4 h-4" />
        Order Information
      </h3>
      <div className="space-y-3 md:space-y-4">
        {/* Vendor Information */}
        <div className="flex items-start gap-2">
          <Store className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={order.vendorAvatar || "/fallback.png"} 
                alt={order.vendorName || "Vendor"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/fallback.png";
                }}
              />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Vendor</p>
              <p className="text-xs text-gray-800 font-medium">
                {order.vendorName || "Unknown Vendor"}
              </p>
              {order.vendorUsername && (
                <p className="text-xs text-gray-500">
                  @{order.vendorUsername}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Customer Name</p>
            <p className="text-xs text-gray-800 font-medium">
              {order.customerName || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Phone Number</p>
            <p className="text-xs text-gray-800 font-medium">
              {order.phone || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Delivery Address</p>
            <p className="text-xs text-gray-800 font-medium">
              {order.address || "-"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3">
          <div className="flex-1 flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Payment Status</p>
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
                {new Date(order.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-start gap-2">
            <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Order Time</p>
              <p className="text-xs text-gray-800 font-medium">
                {new Date(order.createdAt || Date.now()).toLocaleTimeString([], {
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
            {order.deliveryTime && (
              <div className="flex-1 flex items-start gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Delivery Time</p>
                  <p className="text-xs text-gray-800 font-medium">
                    {new Date(`2000-01-01T${order.deliveryTime}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
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
              <p className="text-xs text-gray-800 font-medium">
                {order.note}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;
