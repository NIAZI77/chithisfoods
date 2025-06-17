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
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import PaymentMetrics from "./components/PaymentMetrics";
import PaymentFilters from "./components/PaymentFilters";
import PaymentOrdersTable from "./components/PaymentOrdersTable";
import { customScrollbarStyles } from "./constants";
import PaymentConfirmationDialog from "./components/PaymentConfirmationDialog";
import TaxMetrics from "./components/TaxMetrics";

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
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fullOrders, setFullOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState("this-week");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [processingPayments, setProcessingPayments] = useState({});
  const [processingRefunds, setProcessingRefunds] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (!AdminJWT || !AdminUser) {
      toast.error("Please login to continue.");
      router.push("/admin/login");
    }
  }, []);

  const paymentMetrics = useMemo(() => ({
    totalOrders: fullOrders.length,
    deliveredOrders: fullOrders.filter(order => order.orderStatus === "delivered").length,
    cancelledOrders: fullOrders.filter(order => order.orderStatus === "cancelled").length,
    totalVendorPayments: fullOrders
      .filter(order => order.orderStatus === "delivered" && order.vendor_payment === "unpaid")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalCancelledRefunds: fullOrders
      .filter(order => order.orderStatus === "cancelled" && order.paymentStatus !== "refunded" && order.vendor_payment !== "refunded")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalTax: fullOrders.reduce((sum, order) => sum + (order.tax || 0), 0),
    deliveredOrdersTax: fullOrders
      .filter(order => order.orderStatus === "delivered")
      .reduce((sum, order) => sum + (order.tax || 0), 0),
  }), [fullOrders]);

  const fetchOrders = async (page = 1, timeFilter = "all-time", orderStatusFilter = "all", paymentStatusFilter = "all") => {
    try {
      setLoading(true);
      setError(null);

      const pageSize = 20;
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const sort = "sort[0]=createdAt:desc";

      let filters = [];

      if (timeFilter !== "all-time") {
        const currentDate = new Date();
        let startDate;

        if (timeFilter === "this-week") {
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
        } else if (timeFilter === "this-month") {
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
          filters.push(`filters[createdAt][$lte]=${currentDate.toISOString()}`);
        }
      }

      if (orderStatusFilter !== "all") {
        filters.push(`filters[orderStatus][$eq]=${orderStatusFilter}`);
      } else {
        filters.push(`filters[$or][0][orderStatus][$eq]=delivered`);
        filters.push(`filters[$or][1][orderStatus][$eq]=cancelled`);
      }

      if (paymentStatusFilter !== "all") {
        filters.push(`filters[paymentStatus][$eq]=${paymentStatusFilter}`);
      }

      filters.push(`populate=*`);

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}&${pagination}${filtersString}`;

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

  const fetchFullOrders = async (timeFilter = "all-time", orderStatusFilter = "all", paymentStatusFilter = "all") => {
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const sort = "sort[0]=createdAt:desc";

      let filters = [];

      if (timeFilter !== "all-time") {
        const currentDate = new Date();
        let startDate;

        if (timeFilter === "this-week") {
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
        } else if (timeFilter === "this-month") {
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
          filters.push(`filters[createdAt][$lte]=${currentDate.toISOString()}`);
        }
      }

      if (orderStatusFilter !== "all") {
        filters.push(`filters[orderStatus][$eq]=${orderStatusFilter}`);
      } else {
        filters.push(`filters[$or][0][orderStatus][$eq]=delivered`);
        filters.push(`filters[$or][1][orderStatus][$eq]=cancelled`);
      }

      if (paymentStatusFilter !== "all") {
        filters.push(`filters[paymentStatus][$eq]=${paymentStatusFilter}`);
      }

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}${filtersString}&pagination[limit]=9999999999`;

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
    fetchOrders(1, newFilter, orderStatusFilter, paymentStatusFilter);
    fetchFullOrders(newFilter, orderStatusFilter, paymentStatusFilter);
  };

  const handleOrderStatusFilterChange = (newFilter) => {
    setOrderStatusFilter(newFilter);
    setCurrentPage(1);
    fetchOrders(1, timeFilter, newFilter, paymentStatusFilter);
    fetchFullOrders(timeFilter, newFilter, paymentStatusFilter);
  };

  const handlePaymentStatusFilterChange = (newFilter) => {
    setPaymentStatusFilter(newFilter);
    setCurrentPage(1);
    fetchOrders(1, timeFilter, orderStatusFilter, newFilter);
    fetchFullOrders(timeFilter, orderStatusFilter, newFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, timeFilter, orderStatusFilter, paymentStatusFilter);
  };

  const processVendorPayment = async (orderId) => {
    try {
      const order = orders.find(o => o.documentId === orderId);
      if (!order) return;
      if (order.orderStatus !== "delivered" || order.vendor_payment !== "unpaid") return;

      // Fetch vendor data to check PayPal email
      const vendorResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${order.vendorId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!vendorResponse.ok) return;

      const vendorData = await vendorResponse.json();
      if (!vendorData.data?.paypalEmail) return;

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

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.documentId === orderId
            ? { ...order, vendor_payment: "paid" }
            : order
        )
      );

      toast.success("Vendor payment processed successfully!");

      await fetchOrders(currentPage, timeFilter, orderStatusFilter, paymentStatusFilter);
      await fetchFullOrders(timeFilter, orderStatusFilter, paymentStatusFilter);
    } catch (err) {
      toast.error(err.message || "Failed to process vendor payment");
      console.error("Error processing vendor payment:", err);
    } finally {
      setProcessingPayments(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const processRefund = async (orderId) => {
    try {
      const order = orders.find(o => o.documentId === orderId);
      if (!order) return;
      if (order.orderStatus !== "cancelled") return;
      if (!order.refundEmail) return;

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

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.documentId === orderId
            ? { ...order, paymentStatus: "refunded", vendor_payment: "refunded" }
            : order
        )
      );

      toast.success("Refund processed successfully!");

      await fetchOrders(currentPage, timeFilter, orderStatusFilter, paymentStatusFilter);
      await fetchFullOrders(timeFilter, orderStatusFilter, paymentStatusFilter);
    } catch (err) {
      toast.error(err.message || "Failed to process refund");
      console.error("Error processing refund:", err);
    } finally {
      setProcessingRefunds(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleVendorPaymentClick = (orderId) => {
    const order = orders.find(o => o.documentId === orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }
    if (order.orderStatus !== "delivered" || order.vendor_payment !== "unpaid") {
      toast.error("Order is not in a valid state for vendor payment");
      return;
    }
    setSelectedOrder(order);
    setDialogType("payment");
    setDialogOpen(true);
  };

  const handleRefundClick = (orderId) => {
    const order = orders.find(o => o.documentId === orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }
    if (order.orderStatus !== "cancelled") {
      toast.error("Order is not in a valid state for refund");
      return;
    }
    setSelectedOrder(order);
    setDialogType("refund");
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (!selectedOrder) return;
    
    if (dialogType === "payment") {
      await processVendorPayment(selectedOrder.documentId);
    } else if (dialogType === "refund") {
      await processRefund(selectedOrder.documentId);
    }
    
    setDialogOpen(false);
    setSelectedOrder(null);
    setDialogType(null);
  };

  useEffect(() => {
    fetchOrders(currentPage, timeFilter, orderStatusFilter, paymentStatusFilter);
    fetchFullOrders(timeFilter, orderStatusFilter, paymentStatusFilter);
  }, [currentPage, timeFilter, orderStatusFilter, paymentStatusFilter]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 rounded-xl pl-20">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 rounded-xl !pl-20">
        <PaymentConfirmationDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          type={dialogType}
          order={selectedOrder}
          onConfirm={handleDialogConfirm}
          isProcessing={processingPayments[selectedOrder?.documentId] || processingRefunds[selectedOrder?.documentId]}
        />

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 my-4 sm:my-5">Payments</h1>

        <PaymentMetrics metrics={paymentMetrics} />

        <TaxMetrics metrics={paymentMetrics} />

        <PaymentFilters
          timeFilter={timeFilter}
          orderStatusFilter={orderStatusFilter}
          paymentStatusFilter={paymentStatusFilter}
          onTimeFilterChange={handleTimeFilterChange}
          onOrderStatusFilterChange={handleOrderStatusFilterChange}
          onPaymentStatusFilterChange={handlePaymentStatusFilterChange}
        />

        <PaymentOrdersTable
          orders={orders}
          processingPayments={processingPayments}
          processingRefunds={processingRefunds}
          onProcessVendorPayment={handleVendorPaymentClick}
          onProcessRefund={handleRefundClick}
        />

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
    </>
  );
};

export default PaymentsPage;