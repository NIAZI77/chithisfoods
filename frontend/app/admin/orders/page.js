"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/loading";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  "in-process": "bg-indigo-100 text-indigo-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-800",
};

const TIME_FILTERS = {
  "this-week": "This Week",
  "this-month": "This Month",
  "all-time": "All Time",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all-time");

  const orderMetrics = useMemo(() => ({
    total: orders.length,
    delivered: orders.filter(order => order.orderStatus === "delivered").length,
    refunded: orders.filter(order => 
      order.orderStatus === "refunded" || order.orderStatus === "cancelled"
    ).length,
  }), [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Build the API URL with filters
      let apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?sort[0]=createdAt:desc&pagination[page]=${currentPage}&pagination[pageSize]=20`;

      // Add time filter
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (timeFilter === "this-week") {
        apiUrl += `&filters[createdAt][$gte]=${startOfWeek.toISOString()}`;
      } else if (timeFilter === "this-month") {
        apiUrl += `&filters[createdAt][$gte]=${startOfMonth.toISOString()}`;
      }

      // Add status filters
      if (filterStatus !== "all") {
        apiUrl += `&filters[orderStatus][$eq]=${filterStatus}`;
      }

      if (paymentStatus !== "all") {
        apiUrl += `&filters[paymentStatus][$eq]=${paymentStatus}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, timeFilter, filterStatus, paymentStatus]);

  const getStatusClasses = (status) => {
    return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.default;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 rounded-xl pl-20">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 rounded-xl !pl-20">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 my-4 sm:my-5">Orders</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-semibold">
                {orderMetrics.total}
              </h3>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <FaShoppingCart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Delivered Orders</p>
              <h3 className="text-2xl font-semibold">
                {orderMetrics.delivered}
              </h3>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <FaCheckCircle className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Refunded/Cancelled</p>
              <h3 className="text-2xl font-semibold">
                {orderMetrics.refunded}
              </h3>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <FaTimesCircle className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Order Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-process">In Process</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0">
        <div className="min-w-[800px] sm:min-w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Tax
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={`${order.documentId}-${index}`}
                  className="bg-white hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    @{order.vendorUsername}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium w-16 sm:w-20 flex items-center justify-center rounded-full capitalize ${getStatusClasses(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full w-16 sm:w-20 flex items-center justify-center capitalize ${getStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    ${order.tax.toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs sm:text-sm px-2 sm:px-4 gap-2 sm:gap-0">
        <div className="text-gray-600">{orders.length} Results</div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-2 sm:px-3 py-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button className="px-2 sm:px-3 py-1 rounded-md bg-pink-100 text-pink-600 text-xs sm:text-sm">
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-2 sm:px-3 py-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
