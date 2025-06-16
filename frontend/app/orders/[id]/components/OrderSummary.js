import { FaShoppingBag } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import { Truck } from "lucide-react";

const OrderSummary = ({ orderData, currentOrder }) => {
  const orderSubtotal = orderData.reduce((sum, order) => sum + order.subtotal, 0);
  const totalDeliveryFee = orderData.reduce(
    (sum, order) => sum + (Number(order.vendorDeliveryFee) || 0),
    0
  );

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow h-fit">
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <FaShoppingBag className="text-gray-500" size={20} />
          <span>Sub Total</span>
        </div>
        <span className="font-semibold">${orderSubtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <HiOutlineReceiptTax className="text-gray-500" size={20} />
          <span>Tax</span>
        </div>
        <span className="font-semibold">${currentOrder.totalTax.toFixed(2)}</span>
      </div>
      {orderData.some((order) => order.vendorDeliveryFee && order.vendorUsername) && (
        <div className="mb-2">
          {orderData.map((order, idx) =>
            order.vendorDeliveryFee && order.vendorUsername ? (
              <div
                key={order.vendorId || idx}
                className="flex justify-between text-sm text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  {order.vendorUsername}
                </span>
                <span>${Number(order.vendorDeliveryFee).toFixed(2)}</span>
              </div>
            ) : null
          )}
        </div>
      )}
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <Truck className="text-gray-500" size={20} />
          <span>Delivery</span>
        </div>
        <span className="font-semibold">${totalDeliveryFee.toFixed(2)}</span>
      </div>

      <div className="flex justify-between border-t mt-2 pt-3 text-lg font-bold">
        <div className="flex items-center gap-2">
          <LuSquareSigma className="text-gray-500" size={20} />
          <span>Total</span>
        </div>
        <span>${currentOrder.orderTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary; 