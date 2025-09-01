import {
  Clock,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const StatusSummary = ({ totalStatusCounts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStatusCounts.pending}
            </p>
          </div>
          <Clock className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">In Process</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStatusCounts["in-process"]}
            </p>
          </div>
          <Package className="w-6 h-6 text-indigo-500" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Ready</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStatusCounts.ready}
            </p>
          </div>
          <AlertCircle className="w-6 h-6 text-green-500" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStatusCounts.delivered}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-slate-500" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStatusCounts.cancelled}
            </p>
          </div>
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default StatusSummary;
