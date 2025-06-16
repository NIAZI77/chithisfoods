import { STATUS_STYLES } from "../constants";

const getStatusClasses = (status) => {
  return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.default;
};

const OrdersTable = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <div className="text-gray-500 text-lg font-medium">No orders found</div>
        <div className="text-gray-400 text-sm mt-1">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
      <div className="min-w-[800px] sm:min-w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Customer</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Vendor</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Vendor Payment</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Status</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Subtotal</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Delivery Fee</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Tax</th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={`${order.documentId}-${index}`} className="bg-white hover:bg-gray-50 border-b border-gray-100">
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                  {order.customerName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                  @{order.vendorUsername}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                  <span className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium w-16 sm:w-20 flex items-center justify-center rounded-full capitalize mx-auto ${getStatusClasses(order.vendor_payment)}`}>
                    {order.vendor_payment}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                  <span className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full w-16 sm:w-20 flex items-center justify-center capitalize mx-auto ${getStatusClasses(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  ${order.subtotal?.toFixed(2) || "0.00"}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  ${order.deliveryFee?.toFixed(2) || "0.00"}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  ${order.tax.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  ${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable; 