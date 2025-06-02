"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/loading";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";

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
  const [fullOrders, setFullOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [vendorPaymentStatus, setVendorPaymentStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("this-week");
  const [totalPages, setTotalPages] = useState(1);

  const orderMetrics = useMemo(() => ({
    total: fullOrders.length,
    delivered: fullOrders.filter(order => order.orderStatus === "delivered").length,
    refunded: fullOrders.filter(order =>
      order.orderStatus === "refunded" || order.orderStatus === "cancelled"
    ).length,
  }), [fullOrders]);

  const fetchOrders = async (page = 1, orderStatus = "all", vendorPayment = "all", timeFilter = "all-time") => {
    try {
      setLoading(true);
      setError(null);

      const pageSize = 20;
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const sort = "sort[0]=createdAt:desc";

      // Build filters array
      let filters = [];

      // Time filter handling
      if (timeFilter !== "all-time") {
        // Since all data is in 2025, we'll use 2025 dates for filtering
        const baseDate = new Date('2025-01-01T00:00:00.000Z');
        let startDate;

        if (timeFilter === "this-week") {
          // Get the current week's Monday in 2025
          const currentDate = new Date();
          const dayOfWeek = currentDate.getDay();
          const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          
          startDate = new Date(baseDate);
          startDate.setDate(baseDate.getDate() + (currentDate.getDate() - daysToSubtract - 1));
          startDate.setHours(0, 0, 0, 0);
        } else if (timeFilter === "this-month") {
          // Get the current month in 2025
          const currentMonth = new Date().getMonth();
          startDate = new Date(2025, currentMonth, 1);
          startDate.setHours(0, 0, 0, 0);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
        }
      }

      // Order status filter
      if (orderStatus !== "all") {
        filters.push(`filters[orderStatus][$eq]=${orderStatus}`);
      }

      // Vendor payment status filter
      if (vendorPayment !== "all") {
        filters.push(`filters[vendor_payment][$eq]=${vendorPayment}`);
      }

      // Combine all URL parts
      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}&${pagination}${filtersString}`;
      console.log('Orders API URL:', apiUrl);

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

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from API');
      }

      setOrders(data.data);
      setTotalPages(data.meta.pagination.pageCount);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullOrders = async (timeFilter = "all-time") => {
    try {
      setLoading(true);
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const sort = "sort[0]=createdAt:desc";

      // Build filters array for time
      let filters = [];
      
      // Time filter handling
      if (timeFilter !== "all-time") {
        // Since all data is in 2025, we'll use 2025 dates for filtering
        const baseDate = new Date('2025-01-01T00:00:00.000Z');
        let startDate;

        if (timeFilter === "this-week") {
          // Get the current week's Monday in 2025
          const currentDate = new Date();
          const dayOfWeek = currentDate.getDay();
          const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          
          startDate = new Date(baseDate);
          startDate.setDate(baseDate.getDate() + (currentDate.getDate() - daysToSubtract - 1));
          startDate.setHours(0, 0, 0, 0);
        } else if (timeFilter === "this-month") {
          // Get the current month in 2025
          const currentMonth = new Date().getMonth();
          startDate = new Date(2025, currentMonth, 1);
          startDate.setHours(0, 0, 0, 0);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
        }
      }

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?fields[0]=orderStatus&${sort}${filtersString}&pagination[limit]=9999999999`;
      console.log('Full Orders API URL:', apiUrl);

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

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from API');
      }

      setFullOrders(data.data);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
      setFullOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterStatusChange = (newStatus) => {
    setFilterStatus(newStatus);
    setCurrentPage(1); // Reset to first page
    fetchOrders(1, newStatus, vendorPaymentStatus, timeFilter);
  };

  const handleVendorPaymentChange = (newStatus) => {
    setVendorPaymentStatus(newStatus);
    setCurrentPage(1); // Reset to first page
    fetchOrders(1, filterStatus, newStatus, timeFilter);
  };

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setCurrentPage(1); // Reset to first page
    fetchOrders(1, filterStatus, vendorPaymentStatus, newFilter);
    fetchFullOrders(newFilter); // Update metrics when time filter changes
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, filterStatus, vendorPaymentStatus, timeFilter);
  };

  useEffect(() => {
    fetchOrders(currentPage, filterStatus, vendorPaymentStatus, timeFilter);
    fetchFullOrders(timeFilter); // Pass the current time filter
  }, [currentPage, timeFilter]); // Add timeFilter to dependencies

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
            <SelectTrigger className="w-[180px]">
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
          <Select value={vendorPaymentStatus} onValueChange={handleVendorPaymentChange}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Vendor Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendor Payments</SelectItem>
              <SelectItem value="paid">Paid to Vendor</SelectItem>
              <SelectItem value="unpaid">Unpaid to Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0">
        <div className="min-w-[800px] sm:min-w-full">
          {orders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg">
              <div className="text-gray-500 text-lg font-medium">No orders found</div>
              <div className="text-gray-400 text-sm mt-1">Try adjusting your filters</div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    Vendor
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase"
                  >
                    Vendor Payment
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    Tax
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase"
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
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-left">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                      {order.customerName}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                      @{order.vendorUsername}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium w-16 sm:w-20 flex items-center justify-center rounded-full capitalize mx-auto ${getStatusClasses(
                          order.vendor_payment
                        )}`}
                      >
                        {order.vendor_payment}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full w-16 sm:w-20 flex items-center justify-center capitalize mx-auto ${getStatusClasses(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                      ${order.tax.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-left">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
