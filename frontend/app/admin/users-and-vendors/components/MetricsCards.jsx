import React from "react";
import { FaUsers, FaUserTimes, FaStore } from "react-icons/fa";

const MetricsCards = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Total Users */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Users</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{metrics.users.total}</h3>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <FaUsers className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Blocked Users</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">
                {metrics.users.blocked}
              </h3>
            </div>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <FaUserTimes className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Total Vendors */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Vendors</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">
                {metrics.vendors.total}
              </h3>
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <FaStore className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
