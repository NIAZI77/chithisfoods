import StatusBadge from "./StatusBadge";
import { Flame, Calendar, Clock } from "lucide-react";

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow w-full h-72 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-xs">
          Order #{order.customerOrderId}
        </h3>
        <StatusBadge status={order.orderStatus} />
      </div>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(order.createdAt).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      {order.deliveryDate && order.deliveryTime && (
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <Calendar className="w-3 h-3" />
          <span>
            Delivery: {new Date(order.deliveryDate).toLocaleDateString()} at{" "}
            {new Date(`2000-01-01T${order.deliveryTime}`).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
      <div className="space-y-3 flex-1">
        {order.dishes.slice(0, 2).map((item, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-20 md:w-24 relative rounded overflow-hidden flex-shrink-0 aspect-video">
              <img
                src={item.image?.url || "/food.png"}
                alt={item.name || "Food item"}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs text-gray-800 truncate capitalize">
                {item.name || "Unnamed item"}
              </p>
              {item.selectedSpiciness && (
                <p className="text-xs text-orange-500 flex items-center gap-1">
                  <Flame size={14} /> {item.selectedSpiciness}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-orange-600 font-bold text-xs">
                ${parseFloat(item.total || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">
                Qty: {item.quantity || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <button
          onClick={() => onViewDetails(order)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          View Details
        </button>
        <div className="text-sm font-semibold mt-1 flex items-center justify-between">
          <span>x{order.dishes.length} Items </span>
          <span className="text-orange-600">
            ${(order.subtotal + order.vendorDeliveryFee).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 