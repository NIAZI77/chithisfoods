"use client";

import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Pagination from "@/app/components/pagination";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAllOrders = async () => {
    setLoading(true);
    try {
      const user = getCookie("user");
      if (!user) {
        toast.error("Please sign in to view orders");
        return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
      }

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}${statusFilterQuery}${timeFilterQuery}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", errorData);
        throw new Error(
          `Failed to fetch orders: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.data) {
        console.error("No data field in response:", data);
        return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
      }

      setTotalPages(data.meta.pagination.pageCount);
      setTotalOrders(data.meta.pagination.total);
      return data;
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      toast.error(error.message || "Unable to load orders. Please try again.");
      return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByCustomerOrderId = (orders) => {
    if (!Array.isArray(orders)) {
      console.error("Invalid orders data:", orders);
      return [];
    }
    return Object.values(
      orders.reduce((grouped, order) => {
        if (!order.customerOrderId) {
          console.error("Order missing customerOrderId:", order);
          return grouped;
        }
        const id = order.customerOrderId;
        if (!grouped[id]) grouped[id] = [];
        grouped[id].push(order);
        return grouped;
      }, {})
    );
  };

  const formatGroupedOrders = (groupedOrders) => {
    if (!Array.isArray(groupedOrders)) {
      console.error("Invalid grouped orders:", groupedOrders);
      return [];
    }
    return groupedOrders
      .map((orders) => {
        if (!orders || !orders.length) {
          console.error("Invalid order group:", orders);
          return null;
        }
        const firstOrder = orders[0];
        const allDishes = orders.flatMap((order) => order.dishes || []);

        return {
          id: firstOrder.customerOrderId,
          date: new Date(firstOrder.createdAt).toLocaleString("en-US", {
            timeZone: "UTC",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          status: firstOrder.orderStatus,
          items: allDishes.map((dish) => ({
            name: dish.name,
            price: parseFloat(dish.total),
            qty: dish.quantity,
            image: dish.image,
          })),
          orderTotal: firstOrder.orderTotal,
        };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        const groupedOrders = groupOrdersByCustomerOrderId(orders.data);
        const formattedOrders = formatGroupedOrders(groupedOrders);
        setOrderData(formattedOrders);
      } catch (error) {
        toast.error("Failed to load order history");
      }
    };

    fetchOrders();
  }, [statusFilter, timeFilter, currentPage, pageSize]);

  const countByStatus = (status) =>
    orderData.filter((order) => order.status === status).length;

  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: "bg-amber-200 text-amber-900 font-bold w-24 text-center",
      "in-process": "bg-sky-200 text-sky-900 font-bold w-24 text-center",
      ready: "bg-green-200 text-green-900 font-bold w-24 text-center",
      delivered: "bg-emerald-200 text-emerald-900 font-bold w-24 text-center",
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
          "text-xs font-medium px-2 py-1 rounded-full " + statusMap[status]
        }
      >
        {labelMap[status]}
      </span>
    );
  };
  const user = getCookie("user");
  if (!user) {
    toast.error("Please sign in to view orders");
    router.push("/login");
    return null;
  }

  if (!mounted) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-[90%] mx-auto">
      <h2 className="text-lg md:text-xl font-semibold mb-4">ORDER STATUS</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Pending</p>
              <p className="text-xl md:text-2xl font-bold">
                {countByStatus("pending")}
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
                {countByStatus("in-process")}
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
                {countByStatus("ready")}
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
                {countByStatus("delivered")}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Cancelled</p>
              <p className="text-xl md:text-2xl font-bold">
                {countByStatus("cancelled")}
              </p>
            </div>
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-semibold">ORDER HISTORY</h2>
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
        {orderData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">
              {statusFilter !== "all" || timeFilter !== "all"
                ? "Try adjusting your filters"
                : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          orderData.map((order, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow w-full h-72 flex flex-col"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-xs">
                  Order #{order.id}
                </h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500 mb-2">{order.date}</p>
              <div className="space-y-3 flex-1">
                {order.items.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-20 md:w-24 relative rounded overflow-hidden flex-shrink-0 aspect-video">
                      <Image
                        src={item.image?.url || "/fallback.png"}
                        height={64}
                        width={64}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-gray-800 truncate capitalize">
                        {item.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 font-bold text-xs">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  View Details
                </button>
                <div className="text-sm font-semibold mt-1 flex items-center justify-between">
                  <span>x{order.items.length} Items </span>
                  <span className="text-orange-600">
                    ${order.orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && orderData.length >= pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
