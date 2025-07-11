"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import { Package, Filter, Clock } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Pagination from "@/app/components/pagination";
import StatusSummary from "./components/StatusSummary";
import OrderCard from "./components/OrderCard";
import OrderDetailsDialog from "./components/OrderDetailsDialog";
import { useRouter } from "next/navigation";

const TOAST_MESSAGES = {
  AUTH_REQUIRED: "Authentication required. Please log in as a vendor.",
  VENDOR_INFO_ERROR: "Unable to fetch vendor information.",
  VENDOR_NOT_FOUND: "Vendor profile not found. Please contact support.",
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  FETCH_ORDERS_ERROR: "Unable to fetch orders.",
  NO_ORDERS: "No orders found for your store.",
};

// Returns an object with counts for each order status
function getAllStatusCounts(orders) {
  const counts = {
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    if (order.orderStatus && counts.hasOwnProperty(order.orderStatus)) {
      counts[order.orderStatus]++;
    }
  }
  return counts;
}

export default function VendorOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("week");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalStatusCounts, setTotalStatusCounts] = useState({
    pending: 0,
    "in-process": 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  });
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
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndVendorStatus = async () => {
      const user = getCookie("user");
      const jwt = getCookie("jwt");

      if (!user || !jwt) {
        toast.error(TOAST_MESSAGES.AUTH_REQUIRED);
        router.push("/login");
        return;
      }

      try {
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
          toast.error(TOAST_MESSAGES.VENDOR_INFO_ERROR);
          router.push("/become-a-vendor");
          return;
        }

        const vendorData = await vendorRes.json();
        if (!vendorData.data || !vendorData.data[0]?.documentId) {
          toast.error(TOAST_MESSAGES.VENDOR_NOT_FOUND);
          router.push("/become-a-vendor");
          return;
        }

        setVendorId(vendorData.data[0].documentId);
      } catch (error) {
        toast.error(TOAST_MESSAGES.UNEXPECTED_ERROR);
        router.push("/become-a-vendor");
      }
    };

    checkAuthAndVendorStatus();
  }, [router]);

  const fetchStatusCounts = async () => {
    if (!vendorId) return;

    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const allTimeRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const weekRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&filters[createdAt][$gte]=${weekAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const monthRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&filters[createdAt][$gte]=${monthAgo.toISOString()}&fields[0]=orderStatus&pagination[pageSize]=9999999999`,
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
      toast.error(TOAST_MESSAGES.UNEXPECTED_ERROR);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchStatusCounts();
    }
  }, [vendorId]);

  const fetchOrders = async () => {
    if (!vendorId) return;

    setLoading(true);
    try {
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
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        timeFilterQuery = `&filters[createdAt][$gte]=${monthAgo.toISOString()}`;
      }

      const totalCountsRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}&pagination[pageSize]=9999999999`,
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
        toast.error(TOAST_MESSAGES.FETCH_ORDERS_ERROR);
        setOrders([]);
        setTotalPages(1);
        return;
      }
      const ordersData = await ordersRes.json();
      if (!ordersData.data) {
        toast.info(TOAST_MESSAGES.NO_ORDERS);
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
      toast.error(TOAST_MESSAGES.UNEXPECTED_ERROR);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, timeFilter, vendorId]);

  const getStatusCounts = (orders) => {
    const counts = {
      pending: 0,
      "in-process": 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      if (counts.hasOwnProperty(order.orderStatus)) {
        counts[order.orderStatus]++;
      }
    });
    return counts;
  };

  const filteredStatusCounts = getStatusCounts(orders);

  if (loading) return <Loading />;

  return (
    <div className="py-6 pl-20 px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Order Management</h1>
      </div>

      <StatusSummary 
        totalStatusCounts={
          timeFilter === "week" 
            ? statusCountsWeek 
            : timeFilter === "month" 
              ? statusCountsMonth 
              : statusCountsAll
        } 
      />

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
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-orange-50 border-2 border-orange-200 rounded-full p-6 mb-6">
              <Package className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize text-orange-600">
              No Orders Found
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {statusFilter !== "all" || timeFilter !== "all" 
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't received any orders yet. Orders will appear here once customers start placing them."
              }
            </p>
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
              <Filter className="w-4 h-4" />
              <span>
                {statusFilter !== "all" && `Status: ${statusFilter}`}
                {statusFilter !== "all" && timeFilter !== "all" && " • "}
                {timeFilter !== "all" && `Time: ${timeFilter === "week" ? "This Week" : "This Month"}`}
              </span>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(order) => {
                setSelectedOrder(order);
                setIsDialogOpen(true);
              }}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
