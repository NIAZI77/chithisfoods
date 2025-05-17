"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Pagination from "@/app/components/pagination";

const ORDER_STATUS = {
  PENDING: "pending",
  IN_PROCESS: "in-process",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [ORDER_STATUS.IN_PROCESS]: "bg-blue-100 text-blue-800",
  [ORDER_STATUS.READY]: "bg-green-100 text-green-800",
  [ORDER_STATUS.DELIVERED]: "bg-gray-100 text-gray-800",
  [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
};

// StatusBadge component for consistent status styling
const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: "bg-amber-200 text-amber-900 font-bold w-24 text-center",
    "in-process": "bg-sky-200 text-sky-900 font-bold w-24 text-center",
    ready: "bg-emerald-200 text-emerald-900 font-bold w-24 text-center",
    delivered: "bg-gray-200 text-gray-900 font-bold w-24 text-center",
    cancelled: "bg-rose-200 text-rose-900 font-bold w-24 text-center",
  };
  const labelMap = {
    pending: "PENDING",
    "in-process": "IN-PROCESS",
    ready: "READY",
    delivered: "DELIVERED",
    cancelled: "CANCELLED",
  };
  return (
    <span
      className={
        "text-xs font-medium px-2 py-1 rounded-full " +
        (statusMap[status] || "")
      }
    >
      {labelMap[status] || status}
    </span>
  );
};

export default function VendorOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("week");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const [totalStatusCounts, setTotalStatusCounts] = useState({
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Calculate status counts for filtered orders
  const statusCounts = {
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  };
  orders.forEach((order) => {
    if (statusCounts.hasOwnProperty(order.orderStatus)) {
      statusCounts[order.orderStatus]++;
    }
  });

  // Fetch vendor ID only once when component mounts
  useEffect(() => {
    const fetchVendorId = async () => {
      try {
        const user = getCookie("user");
        if (!user) {
          toast.error(
            "Authentication required. Please log in as a vendor to view your orders."
          );
          return;
        }
        const vendorRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        if (!vendorRes.ok) {
          toast.error(
            "Unable to fetch vendor information. Please try again later."
          );
          return;
        }
        const vendorData = await vendorRes.json();
        if (!vendorData.data || !vendorData.data[0]?.documentId) {
          toast.error("Vendor profile not found. Please contact support.");
          return;
        }
        setVendorId(vendorData.data[0].documentId);
      } catch (error) {
        toast.error(
          "An unexpected error occurred while loading vendor information."
        );
      }
    };
    fetchVendorId();
  }, []);

  const fetchOrders = async () => {
    if (!vendorId) return;

    setLoading(true);
    try {
      // Build filter queries
      let statusFilterQuery = "";
      if (statusFilter !== "all") {
        statusFilterQuery = `&filters[orderStatus][$eq]=${statusFilter}`;
      }

      let timeFilterQuery = "";
      const now = new Date();
      if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        timeFilterQuery = `&filters[createdAt][$gte]=${weekAgo.toISOString()}`;
      } else if (timeFilter === "month") {
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        timeFilterQuery = `&filters[createdAt][$gte]=${monthAgo.toISOString()}`;
      }

      // Fetch total counts first
      const totalCountsRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&pagination[pageSize]=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (totalCountsRes.ok) {
        const totalData = await totalCountsRes.json();
        const counts = {
          pending: 0,
          "in-process": 0,
          ready: 0,
          delivered: 0,
          cancelled: 0,
        };
        totalData.data.forEach((order) => {
          if (counts.hasOwnProperty(order.orderStatus)) {
            counts[order.orderStatus]++;
          }
        });
        setTotalStatusCounts(counts);
      }

      // Fetch filtered orders
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}${statusFilterQuery}${timeFilterQuery}&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      if (!ordersRes.ok) {
        toast.error("Unable to fetch orders. Please try again later.");
        setOrders([]);
        setTotalPages(1);
        return;
      }
      const ordersData = await ordersRes.json();
      if (!ordersData.data) {
        toast.info("No orders found for your store.");
        setOrders([]);
        setTotalPages(1);
        return;
      }
      setOrders(
        ordersData.data.map((order) => ({
          ...order,
          customerOrderId: order.customerOrderId,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          dishes: order.dishes,
          subtotal: parseFloat(order.subtotal),
        }))
      );
      setTotalPages(ordersData.meta?.pagination?.pageCount || 1);
    } catch (error) {
      toast.error(
        "An unexpected error occurred while loading orders. Please refresh the page or try again later."
      );
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, timeFilter, vendorId]);

  if (loading) return <Loading />;

  return (
    <div className="py-6 pl-20 px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Order Management</h1>
      </div>

      {/* Status summary boxes */}
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

      {/* Order history and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-semibold">Order History</h2>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-process">In Process</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 place-items-center">
        {orders.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12 text-lg font-semibold">
            No orders found for the selected criteria.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded shadow space-y-2 w-full h-full relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  Order #{order.customerOrderId}
                </h3>
                <StatusBadge status={order.orderStatus} />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <div className="space-y-2 pb-12">
                {order.dishes.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Image
                      height={64}
                      width={64}
                      src={item.image?.url || "/food.png"}
                      alt={item.name}
                      className="w-12 h-full object-cover rounded aspect-video"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">
                        {item.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-bold text-sm">
                        ${parseFloat(item.total).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 pb-2">
                <Link
                  href={`/vendor/order-management/${order.id}`}
                  className="text-xs text-blue-500 underline cursor-pointer"
                >
                  See all
                </Link>
                <div className="text-sm font-semibold">
                  x{order.dishes.length} Items{" "}
                  <span className="text-red-600">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && orders.length >= pageSize && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
