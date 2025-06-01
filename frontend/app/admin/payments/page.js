"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CircleDollarSign,
  Circle,
  Check,
  X,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/loading";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";
import { toast } from 'react-toastify';
import Spinner from "@/app/components/Spinner";
import { FaHandHoldingUsd } from "react-icons/fa";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-green-100 text-green-700",
  default: "bg-gray-100 text-gray-800",
};

const PAYMENT_STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-800",
};

const BUTTON_STYLES = {
  payVendor: "w-40 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm",
  processRefund: "w-40 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm",
};

const TIME_FILTERS = {
  "this-week": "This Week",
  "this-month": "This Month",
  "all-time": "All Time",
};

const ACTION_STATUS_STYLES = {
  refunded: "text-red-600 font-medium flex items-center justify-center gap-2",
  paid: "text-emerald-600 font-medium flex items-center justify-center gap-2",
  default: "text-gray-500 flex items-center justify-center gap-2"
};

const PaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [fullOrders, setFullOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState("this-week");
  const [totalPages, setTotalPages] = useState(1);
  const [processingPayments, setProcessingPayments] = useState({});
  const [processingRefunds, setProcessingRefunds] = useState({});

  const paymentMetrics = useMemo(() => ({
    totalOrders: fullOrders.length,
    deliveredOrders: fullOrders.filter(order => order.orderStatus === "delivered").length,
    cancelledOrders: fullOrders.filter(order => order.orderStatus === "cancelled").length,
    totalVendorPayments: fullOrders
      .filter(order => order.orderStatus === "delivered" && order.vendor_payment === "unpaid")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalCancelledRefunds: fullOrders
      .filter(order => order.orderStatus === "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0),
  }), [fullOrders]);

  const fetchOrders = async (page = 1, timeFilter = "this-week") => {
    try {
      setLoading(true);
      setError(null);

      const pageSize = 20;
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const sort = "sort[0]=createdAt:desc";

      // Build filters array
      let filters = [];

      // Time filter with proper week calculation (Monday start)
      const now = new Date();
      const startOfWeek = new Date(now);
      // Get to the start of the week (Monday)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      if (timeFilter === "this-week") {
        filters.push(`filters[createdAt][$gte]=${startOfWeek.toISOString()}`);
      } else if (timeFilter === "this-month") {
        filters.push(`filters[createdAt][$gte]=${startOfMonth.toISOString()}`);
      }

      // Use $or operator for order statuses to show orders that need payment processing
      filters.push(`filters[$or][0][orderStatus][$eq]=delivered`);
      filters.push(`filters[$or][1][orderStatus][$eq]=cancelled`);
      filters.push(`populate=*`);

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}&${pagination}${filtersString}`;
      console.log('Fetching orders with URL:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data);
      setTotalPages(data.meta.pagination.pageCount);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullOrders = async (timeFilter = "this-week") => {
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const sort = "sort[0]=createdAt:desc";

      let filters = [];

      // Time filter with proper week calculation (Monday start)
      const now = new Date();
      const startOfWeek = new Date(now);
      // Get to the start of the week (Monday)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      if (timeFilter === "this-week") {
        filters.push(`filters[createdAt][$gte]=${startOfWeek.toISOString()}`);
      } else if (timeFilter === "this-month") {
        filters.push(`filters[createdAt][$gte]=${startOfMonth.toISOString()}`);
      }

      // Use $or operator to show orders that are either delivered or cancelled
      filters.push(`filters[$or][0][orderStatus][$eq]=delivered`);
      filters.push(`filters[$or][1][orderStatus][$eq]=cancelled`);

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}${filtersString}&pagination[limit]=9999999999`;
      console.log('Fetching full orders with URL:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch orders");
      }

      const data = await response.json();
      setFullOrders(data.data);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    }
  };

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setCurrentPage(1);
    fetchOrders(1, newFilter);
    fetchFullOrders(newFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, timeFilter);
  };

  const processVendorPayment = async (orderId) => {
    try {
      // Validate order exists and is in correct state
      const order = orders.find(o => o.documentId === orderId);
      if (!order) {
        toast.error("Order not found");
        return;
      }
      if (order.orderStatus !== "delivered" || order.vendor_payment !== "unpaid") {
        toast.error("Order is not in a valid state for vendor payment");
        return;
      }

      setProcessingPayments(prev => ({ ...prev, [orderId]: true }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            vendor_payment: "paid"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to process vendor payment");
      }

      // Optimistically update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.documentId === orderId
            ? { ...order, vendor_payment: "paid" }
            : order
        )
      );

      toast.success("Vendor payment processed successfully!");

      // Refresh orders after successful payment
      await fetchOrders(currentPage, timeFilter);
      await fetchFullOrders(timeFilter);
    } catch (err) {
      toast.error(err.message || "Failed to process vendor payment");
      console.error("Error processing vendor payment:", err);
    } finally {
      setProcessingPayments(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const processRefund = async (orderId) => {
    try {
      // Validate order exists and is in correct state
      const order = orders.find(o => o.documentId === orderId);
      if (!order) {
        toast.error("Order not found");
        return;
      }
      if (order.orderStatus !== "cancelled") {
        toast.error("Order is not in a valid state for refund");
        return;
      }

      setProcessingRefunds(prev => ({ ...prev, [orderId]: true }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            paymentStatus: "refunded",
            vendor_payment: "refunded"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to process refund");
      }

      // Optimistically update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.documentId === orderId
            ? { ...order, paymentStatus: "refunded" }
            : order
        )
      );

      toast.success("Refund processed successfully!");

      // Refresh orders after successful refund
      await fetchOrders(currentPage, timeFilter);
      await fetchFullOrders(timeFilter);
    } catch (err) {
      toast.error(err.message || "Failed to process refund");
      console.error("Error processing refund:", err);
    } finally {
      setProcessingRefunds(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, timeFilter);
    fetchFullOrders(timeFilter);
  }, [currentPage, timeFilter]);

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

      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 my-4 sm:my-5">Payments</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-semibold">{paymentMetrics.totalOrders}</h3>
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
              <h3 className="text-2xl font-semibold">{paymentMetrics.deliveredOrders}</h3>
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
              <h3 className="text-2xl font-semibold">{paymentMetrics.cancelledOrders}</h3>
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
                ${paymentMetrics.totalVendorPayments.toFixed(2)}
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
                ${paymentMetrics.totalCancelledRefunds.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CircleDollarSign className="w-6 h-6 text-red-600" />
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
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0">
        <div className="min-w-[800px] sm:min-w-full">
          {orders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg">
              <div className="text-gray-500 text-lg font-medium">No orders requiring payment processing</div>
              <div className="text-gray-400 text-sm mt-1">Try adjusting your filters</div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Payment Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Vendor Payment</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Tax</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Pay to Vendor</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Total Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.documentId} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">@{order.vendorUsername}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center justify-center w-24 text-center capitalize ${STATUS_STYLES[order.orderStatus] || STATUS_STYLES.default}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full text-center flex items-center justify-center w-24 capitalize ${PAYMENT_STATUS_STYLES[order.paymentStatus] || PAYMENT_STATUS_STYLES.default}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full text-center flex items-center justify-center w-24 capitalize ${STATUS_STYLES[order.vendor_payment] || STATUS_STYLES.default}`}>
                        {order.vendor_payment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${order.tax?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-emerald-600">
                      ${((order.subtotal || 0) + (order.deliveryFee || 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center space-y-2">
                      {order.orderStatus === "delivered" && order.vendor_payment === "unpaid" && (
                        <button
                          onClick={() => processVendorPayment(order.documentId)}
                          disabled={processingPayments[order.documentId]}
                          className={`${BUTTON_STYLES.payVendor} ${processingPayments[order.documentId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {processingPayments[order.documentId] ? (
                            <span className="flex items-center justify-center gap-2">
                              <Spinner />
                            </span>
                          ) : (
                            <>
                              <FaHandHoldingUsd className="w-4 h-4" />
                              Pay Vendor
                            </>
                          )}
                        </button>
                      )}
                      {order.orderStatus === "cancelled" && order.paymentStatus !== "refunded" && order.vendor_payment !== "refunded" && (
                        <button
                          onClick={() => processRefund(order.documentId)}
                          disabled={processingRefunds[order.documentId]}
                          className={`${BUTTON_STYLES.processRefund} ${processingRefunds[order.documentId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {processingRefunds[order.documentId] ? (
                            <span className="flex items-center justify-center gap-2">
                              <Spinner />
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-xs">
                              <CircleDollarSign className="w-4 h-4" />
                              Process Refund
                            </div>
                          )}
                        </button>
                      )}
                      {!((order.orderStatus === "delivered" && order.vendor_payment === "unpaid") ||
                        (order.orderStatus === "cancelled" && order.paymentStatus !== "refunded" && order.vendor_payment !== "refunded")) && (
                          <span className={`${ACTION_STATUS_STYLES[order.paymentStatus === "refunded" || order.vendor_payment === "refunded" ? "refunded" : order.vendor_payment === "paid" ? "paid" : "default"]}`}>
                            {order.paymentStatus === "refunded" || order.vendor_payment === "refunded" ? (
                              <>
                                <X className="w-4 h-4" />
                                Refunded
                              </>
                            ) : order.vendor_payment === "paid" ? (
                              <>
                                <Check className="w-4 h-4" />
                                Paid to Vendor
                              </>
                            ) : (
                              <>
                                <Info className="w-4 h-4" />
                                No Action Required
                              </>
                            )}
                          </span>
                        )}
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

export default PaymentsPage;