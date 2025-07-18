"use client";

import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
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
  Calendar,
  ShoppingBag,
  Search,
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
  const [statusCountsAll, setStatusCountsAll] = useState({
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [statusCountsWeek, setStatusCountsWeek] = useState({
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [statusCountsMonth, setStatusCountsMonth] = useState({
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const userCookie = getCookie("user");
    setUser(userCookie);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!user) {
      toast.error("Please sign in to view orders");
      router.push("/login");
      return;
    }

    fetchStatusCounts();
  }, [mounted, user, router]);

  const fetchStatusCounts = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      // Fetch all time counts
      const allTimeRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      // Fetch week counts
      const weekRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}&filters[createdAt][$gte]=${weekAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      // Fetch month counts
      const monthRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}&filters[createdAt][$gte]=${monthAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (allTimeRes.ok && weekRes.ok && monthRes.ok) {
        const allTimeData = await allTimeRes.json();
        const weekData = await weekRes.json();
        const monthData = await monthRes.json();

        const processCounts = (data) => {
          const counts = {
            pending: 0,
            "in-process": 0,
            ready: 0,
            delivered: 0,
            cancelled: 0,
          };
          data.data.forEach((order) => {
            if (counts.hasOwnProperty(order.orderStatus)) {
              counts[order.orderStatus]++;
            }
          });
          return counts;
        };

        setStatusCountsAll(processCounts(allTimeData));
        setStatusCountsWeek(processCounts(weekData));
        setStatusCountsMonth(processCounts(monthData));
      }
    } catch (error) {
      console.error("Error fetching status counts:", error);
      toast.error("Failed to load order status counts");
    }
  };

  const getAllOrders = async () => {
    if (!user) return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
    
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}${statusFilterQuery}${timeFilterQuery}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`,
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

        // Determine the status based on priority
        let finalStatus = firstOrder.orderStatus;
        const hasPending = orders.some(order => order.orderStatus === 'pending');
        const hasInProcess = orders.some(order => order.orderStatus === 'in-process');

        if (hasPending) {
          finalStatus = 'pending';
        } else if (hasInProcess) {
          finalStatus = 'in-process';
        }

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
          deliveryDate: firstOrder.deliveryDate,
          deliveryTime: firstOrder.deliveryTime,
          status: finalStatus,
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
    if (!mounted || !user) return;

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
  }, [mounted, user, statusFilter, timeFilter, currentPage, pageSize]);

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

  if (!mounted) {
    return null;
  }

  if (loading || !user) {
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
                {timeFilter === "week" 
                  ? statusCountsWeek.pending 
                  : timeFilter === "month" 
                    ? statusCountsMonth.pending 
                    : statusCountsAll.pending}
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
                {timeFilter === "week" 
                  ? statusCountsWeek["in-process"] 
                  : timeFilter === "month" 
                    ? statusCountsMonth["in-process"] 
                    : statusCountsAll["in-process"]}
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
                {timeFilter === "week" 
                  ? statusCountsWeek.ready 
                  : timeFilter === "month" 
                    ? statusCountsMonth.ready 
                    : statusCountsAll.ready}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Delivered</p>
              <p className="text-xl md:text-2xl font-bold">
                {timeFilter === "week" 
                  ? statusCountsWeek.delivered 
                  : timeFilter === "month" 
                    ? statusCountsMonth.delivered 
                    : statusCountsAll.delivered}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Cancelled</p>
              <p className="text-xl md:text-2xl font-bold">
                {timeFilter === "week" 
                  ? statusCountsWeek.cancelled 
                  : timeFilter === "month" 
                    ? statusCountsMonth.cancelled 
                    : statusCountsAll.cancelled}
              </p>
            </div>
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
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
          <div className="col-span-full text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-rose-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-rose-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 capitalize text-rose-600">
                {statusFilter !== "all" || timeFilter !== "all"
                  ? "No orders match your filters"
                  : "No orders found"}
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {statusFilter !== "all" || timeFilter !== "all"
                  ? "Try adjusting your status or time filters to see more results."
                  : "You haven't placed any orders yet. Start exploring our delicious menu and place your first order!"}
              </p>
              {statusFilter !== "all" || timeFilter !== "all" ? (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setTimeFilter("all");
                  }}
                  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Search className="w-4 h-4" />
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Menu
                </Link>
              )}
            </div>
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
              {order.deliveryDate && order.deliveryTime && (
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Delivery: {new Date(order.deliveryDate).toLocaleDateString()} at{" "}
                    {new Date(`2000-01-01T${order.deliveryTime}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <div className="space-y-3 flex-1">
                {order.items.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-20 md:w-24 relative rounded overflow-hidden flex-shrink-0 aspect-video">
                      <img
                        src={item.image?.url || "/fallback.png"}
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
