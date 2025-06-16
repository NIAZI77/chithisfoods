import { DollarSign, CheckCircle2, XCircle, CircleDollarSign } from "lucide-react";
import { FaHandHoldingUsd } from "react-icons/fa";

const PaymentMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Orders</p>
            <h3 className="text-2xl font-semibold">{metrics.totalOrders}</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Delivered Orders</p>
            <h3 className="text-2xl font-semibold">{metrics.deliveredOrders}</h3>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Cancelled Orders</p>
            <h3 className="text-2xl font-semibold">{metrics.cancelledOrders}</h3>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs">Pending Vendor Payments</p>
            <h3 className="text-2xl font-semibold">
              ${metrics.totalVendorPayments.toFixed(2)}
            </h3>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <FaHandHoldingUsd className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Pending Refunds</p>
            <h3 className="text-2xl font-semibold">
              ${metrics.totalCancelledRefunds.toFixed(2)}
            </h3>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <CircleDollarSign className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMetrics; 