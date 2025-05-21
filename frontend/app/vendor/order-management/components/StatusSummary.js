import { Clock, Package, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const StatusSummary = ({ totalStatusCounts }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500">Pending</p>
            <p className="text-xl md:text-2xl font-bold">
              {totalStatusCounts.pending}
            </p>
          </div>
          <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500">In Process</p>
            <p className="text-xl md:text-2xl font-bold">
              {totalStatusCounts["in-process"]}
            </p>
          </div>
          <Package className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500">Ready</p>
            <p className="text-xl md:text-2xl font-bold">
              {totalStatusCounts.ready}
            </p>
          </div>
          <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500">Delivered</p>
            <p className="text-xl md:text-2xl font-bold">
              {totalStatusCounts.delivered}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500">Cancelled</p>
            <p className="text-xl md:text-2xl font-bold">
              {totalStatusCounts.cancelled}
            </p>
          </div>
          <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default StatusSummary; 