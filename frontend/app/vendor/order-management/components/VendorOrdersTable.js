import { Eye, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_STYLES, customScrollbarStyles } from "../constants";
import DeliveryTypeBadge from "@/components/DeliveryTypeBadge";

const getStatusClasses = (status) => {
  return STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.default;
};

const VendorOrdersTable = ({ orders, onViewDetails }) => {
  if (orders.length === 0) {
    return (
      <>
        <style>{customScrollbarStyles}</style>
        <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
          <div className="min-w-[1000px] sm:min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Serial No</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Buyer Name</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Items</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Status</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Type</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Net Amount</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Delivery Fee</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Total</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="10" className="px-4 py-16">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-orange-50">
                        <ClipboardList className="w-8 h-8 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        You haven&apos;t received any orders yet. Orders will appear here once customers start placing them.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
        <div className="min-w-[1000px] sm:min-w-full">
          <table className="w-full">
                          <thead>
                <tr className="border-b border-gray-200">
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Serial No</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Buyer Name</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Items</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Status</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Order Type</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Net Amount</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Delivery Fee</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Total</th>
                  <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={`${order.documentId}-${index}`} className="bg-white hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                    {order.customerName || "Pickup Customer"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                    {order.dishes?.length || 0} items
                  
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                    <span className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full capitalize mx-auto ${getStatusClasses(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                    <DeliveryTypeBadge deliveryType={order.deliveryType} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                    ${(order.subtotal || 0).toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                    {order.deliveryType === 'pickup' ? 'Pickup' : `$${(order.deliveryFee || 0).toFixed(2)}`}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-semibold">
                    ${(order.subtotal + order.deliveryFee || 0).toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                    <Button
                      onClick={() => onViewDetails(order)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VendorOrdersTable;
