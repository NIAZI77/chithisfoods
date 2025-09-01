"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ClipboardList,
} from "lucide-react";
import Loading from "@/app/loading";
import SearchComponent from "@/components/SearchComponent";
import TableLoading from "@/components/TableLoading";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Pagination from "@/app/components/pagination";
import OrderDetailsDialog from "./components/OrderDetailsDialog";
import DeliveryTypeBadge from "@/components/DeliveryTypeBadge";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const [userData, setUserData] = useState({});

  // Utility function to get current user ID consistently
  const getCurrentUserId = () => {
    const userId =
      userData?.id ||
      userData?.email ||
      userData?.username ||
      user ||
      getCookie("user");

    // Log for debugging
    if (!userId) {
      console.warn("No user ID found:", {
        userDataId: userData?.id,
        userDataEmail: userData?.email,
        userDataUsername: userData?.username,
        user: user,
        cookieUser: getCookie("user"),
      });
    }

    return userId;
  };

  // Utility function to check if user has reviewed a dish
  const hasUserReviewedDish = (dish) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !dish.reviews) return false;

    const hasReviewed = dish.reviews.some(
      (review) =>
        review.userId === currentUserId ||
        review.userId === userData?.id ||
        review.userId === userData?.email ||
        review.userId === userData?.username ||
        review.userId === user ||
        review.userId === getCookie("user")
    );

    // Log for debugging
    if (hasReviewed) {
      // User has already reviewed this dish
    }

    return hasReviewed;
  };

  // Utility function to validate review data
  const validateReviewData = (dish) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      return {
        isValid: false,
        error:
          "Unable to identify user. Please refresh the page and try again.",
      };
    }

    if (!dish || !dish.id) {
      return { isValid: false, error: "Invalid dish data. Please try again." };
    }

    if (hasUserReviewedDish(dish)) {
      return {
        isValid: false,
        error:
          "You have already reviewed this dish! Each dish can only be reviewed once.",
      };
    }

    return { isValid: true, error: null };
  };

  // Utility function to get review status for a dish
  const getDishReviewStatus = (dish) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !dish.reviews)
      return { hasReviewed: false, review: null };

    const userReview = dish.reviews.find(
      (review) =>
        review.userId === currentUserId ||
        review.userId === userData?.id ||
        review.userId === userData?.email ||
        review.userId === userData?.username ||
        review.userId === user ||
        review.userId === getCookie("user")
    );

    return {
      hasReviewed: !!userReview,
      review: userReview,
    };
  };

  const fetchUserData = async () => {
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        console.error("No JWT token found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.ok) {
        const userDataJson = await response.json();
        setUserData(userDataJson);
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    setMounted(true);
    const userCookie = getCookie("user");
    setUser(userCookie);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      toast.error("Please sign in to view your order history");
      router.push("/login");
      return;
    }

    fetchUserData();
    fetchStatusCounts();
  }, [mounted, user, router]);

  const fetchStatusCounts = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

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

      if (allTimeRes.ok) {
        const allTimeData = await allTimeRes.json();
        const allTimeOrders = allTimeData.data || [];

        // Count statuses for all time
        const allTimeCounts = allTimeOrders.reduce(
          (counts, order) => {
            const status = order.orderStatus?.toLowerCase();
            if (status && counts.hasOwnProperty(status)) {
              counts[status]++;
            }
            return counts;
          },
          { pending: 0, "in-process": 0, ready: 0, delivered: 0, cancelled: 0 }
        );

        setStatusCountsAll(allTimeCounts);
      } else {
        console.error(
          "Failed to fetch all-time status counts:",
          allTimeRes.status
        );
      }

      // Fetch week counts
      const weekRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_HOST
        }/api/orders?filters[user][$eq]=${user}&filters[createdAt][$gte]=${weekAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (weekRes.ok) {
        const weekData = await weekRes.json();
        const weekOrders = weekData.data || [];

        // Count statuses for week
        const weekCounts = weekOrders.reduce(
          (counts, order) => {
            const status = order.orderStatus?.toLowerCase();
            if (status && counts.hasOwnProperty(status)) {
              counts[status]++;
            }
            return counts;
          },
          { pending: 0, "in-process": 0, ready: 0, delivered: 0, cancelled: 0 }
        );

        setStatusCountsWeek(weekCounts);
      } else {
        console.error("Failed to fetch week status counts:", weekRes.status);
      }

      // Fetch month counts
      const monthRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_HOST
        }/api/orders?filters[user][$eq]=${user}&filters[createdAt][$gte]=${monthAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (monthRes.ok) {
        const monthData = await monthRes.json();
        const monthOrders = monthData.data || [];

        // Count statuses for month
        const monthCounts = monthOrders.reduce(
          (counts, order) => {
            const status = order.orderStatus?.toLowerCase();
            if (status && counts.hasOwnProperty(status)) {
              counts[status]++;
            }
            return counts;
          },
          { pending: 0, "in-process": 0, ready: 0, delivered: 0, cancelled: 0 }
        );

        setStatusCountsMonth(monthCounts);
      } else {
        console.error("Failed to fetch month status counts:", monthRes.status);
      }
    } catch (error) {
      console.error("Error fetching status counts:", error);
      toast.error(
        "We're having trouble loading your order statistics right now. Please try again."
      );
    }
  };

  const getAllOrders = async () => {
    if (!user)
      return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };

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

      let searchQueryParam = "";
      if (currentSearchQuery) {
        searchQueryParam = `&search=${encodeURIComponent(currentSearchQuery)}`;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[user][$eq]=${user}${statusFilterQuery}${timeFilterQuery}${searchQueryParam}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "API Error Response:",
          response.status,
          response.statusText,
          errorData
        );

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 403) {
          throw new Error(
            "Access denied. You don't have permission to view these orders."
          );
        } else if (response.status === 404) {
          throw new Error("Orders not found. Please check your account.");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(
            `Failed to fetch orders: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = await response.json();

      if (!data) {
        console.error("No response data received");
        throw new Error("No data received from server");
      }

      if (!data.data) {
        console.error("No data field in response:", data);
        return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
      }

      // Debug: Log the first order to see its structure
      if (data.data.length > 0) {
      }

      setTotalPages(data.meta?.pagination?.pageCount || 1);
      setTotalOrders(data.meta?.pagination?.total || 0);
      return data;
    } catch (error) {
      console.error("Error in getAllOrders:", error);

      // Provide user-friendly error messages
      let errorMessage = "Unable to load orders. Please try again.";

      if (error.message.includes("Authentication failed")) {
        errorMessage = "Please log in again to view your orders.";
        router.push("/login");
      } else if (error.message.includes("Access denied")) {
        errorMessage = "You don't have permission to view these orders.";
      } else if (error.message.includes("Server error")) {
        errorMessage =
          "Server is temporarily unavailable. Please try again later.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      toast.error(errorMessage);
      return { data: [], meta: { pagination: { total: 0, pageCount: 0 } } };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        // Use orders directly without formatting
        setOrderData(orders.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(
          "We're having trouble loading your orders right now. Please try again."
        );

        setOrderData([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    };

    fetchOrders();
  }, [
    mounted,
    user,
    statusFilter,
    timeFilter,
    currentSearchQuery,
    currentPage,
    pageSize,
  ]);

  const handleViewDetails = (order) => {
    if (!order) {
      console.error("handleViewDetails: order is undefined");
      return;
    }

    if (!order.documentId) {
      console.error("handleViewDetails: order.documentId is missing:", order);
      return;
    }

    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    // Refresh orders after status update
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        setOrderData(orders.data || []);
      } catch (error) {
        console.error("Error refreshing orders:", error);
        // Don't show toast as getAllOrders already handles it
        // Just set empty data to prevent UI errors
        setOrderData([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    };
    fetchOrders();
  };

  const getStatusClasses = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    const STATUS_STYLES = {
      pending: "bg-yellow-100 text-yellow-700",
      "in-process": "bg-indigo-100 text-indigo-700",
      ready: "bg-green-100 text-green-700",
      delivered: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
      default: "bg-gray-100 text-gray-800",
    };
    return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.default;
  };

  const countByStatus = (status) =>
    orderData.filter((order) => order.orderStatus === status).length;

  const StatusBadge = ({ status }) => {
    if (!status) return null;

    const statusMap = {
      pending: "bg-yellow-200 text-yellow-900 font-bold w-24 text-center",
      "in-process": "bg-indigo-200 text-indigo-900 font-bold w-24 text-center",
      ready: "bg-green-200 text-green-900 font-bold w-24 text-center",
      delivered: "bg-slate-200 text-slate-900 font-bold w-24 text-center",
      cancelled: "bg-red-200 text-red-900 font-bold w-24 text-center",
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
          (statusMap[status] || statusMap.default)
        }
      >
        {labelMap[status] || status.toUpperCase()}
      </span>
    );
  };

  if (!mounted) {
    return null;
  }

  if (loading && orderData.length === 0) {
    return <Loading />;
  }

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">ORDER STATUS</h2>
      </div>

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
            <Package className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
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
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-500" />
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
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-semibold">ORDER HISTORY</h2>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
          <SearchComponent
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={(e) => {
              e.preventDefault();
              setCurrentSearchQuery(searchQuery);
            }}
            placeholder="Search order"
            buttonColor="bg-rose-600 hover:bg-rose-700"
            shadowColor="shadow-rose-300"
          />
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
      {/* Table Layout */}
      {orderData.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-orange-50">
            <ClipboardList className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Orders will appear here once
            you start shopping.
          </p>
        </div>
      ) : (
        <>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #666;
            }
          `}</style>
          {loading ? (
            <TableLoading rows={10} columns={8} />
          ) : (
            <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
              <div className="min-w-[800px] sm:min-w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Order Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Order Status
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Order Type
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderData.map((order, index) => {
                      // Calculate proper values with fallbacks
                      const subtotal =
                        parseFloat(order.subtotal) ||
                        parseFloat(order.totalAmount) ||
                        0;
                      const deliveryFee =
                        parseFloat(order.deliveryFee) ||
                        parseFloat(order.vendorDeliveryFee) ||
                        0;
                      const tax =
                        parseFloat(order.tax) ||
                        parseFloat(order.totalTax) ||
                        0;
                      const totalAmount =
                        parseFloat(order.totalAmount) ||
                        parseFloat(order.orderTotal) ||
                        subtotal + deliveryFee + tax;

                      return (
                        <tr
                          key={`${
                            order.searchableOrderId || order.id
                          }-${index}`}
                          className="bg-white hover:bg-gray-50 border-b border-gray-100"
                        >
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-medium">
                            {order.searchableOrderId || "N/A"}
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mb-1">
                                <img
                                  src={order.vendorAvatar || "/fallback.png"}
                                  alt={order.vendorName || "Vendor"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/fallback.png";
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-700 font-medium truncate max-w-[80px]">
                                {order.vendorName || "Unknown Vendor"}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                            {Array.isArray(order.dishes)
                              ? order.dishes.length
                              : 0}{" "}
                            items
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                            <span
                              className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full capitalize mx-auto ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus || "Unknown"}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                            <DeliveryTypeBadge
                              deliveryType={order.deliveryType || "delivery"}
                            />
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-semibold">
                            ${totalAmount.toFixed(2)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && orderData.length >= pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Order Details Dialog - Only render when dialog is open */}
      {isDialogOpen && (
        <OrderDetailsDialog
          order={selectedOrder}
          userData={userData}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          getCurrentUserId={getCurrentUserId}
          hasUserReviewedDish={hasUserReviewedDish}
          validateReviewData={validateReviewData}
          getDishReviewStatus={getDishReviewStatus}
        />
      )}
    </div>
  );
}
