import { FaShoppingCart, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

const MetricsCards = ({ orderMetrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Money</p>
            <p className="text-2xl font-bold text-gray-900">${orderMetrics.totalMoney}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaMoneyBillWave className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orderMetrics.total}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaShoppingCart className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Delivered Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orderMetrics.delivered}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaCheckCircle className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{orderMetrics.refunded}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaTimesCircle className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1 truncate">Uncompleted Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orderMetrics.uncompletedOrders}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaShoppingCart className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards; 