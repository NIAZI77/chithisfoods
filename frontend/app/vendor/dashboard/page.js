"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ShoppingCart, Users, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import Loading from "@/app/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const STATUS_STYLES = {
  pending: "bg-amber-200 text-amber-900 font-bold text-center",
  "in-process": "bg-sky-200 text-sky-900 font-bold text-center",
  ready: "bg-emerald-200 text-emerald-900 font-bold text-center",
  delivered: "bg-gray-200 text-gray-900 font-bold text-center",
  cancelled: "bg-rose-200 text-rose-900 font-bold text-center",
};

const STATUS_LABELS = {
  pending: "PENDING",
  "in-process": "IN-PROCESS",
  ready: "READY",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

const StatusBadge = ({ status }) => (
  <span
    className={`text-xs font-medium px-2 py-1 rounded-full inline-block w-24 ${STATUS_STYLES[status] || ""
      }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

const TimePeriodSelect = ({ value, onValueChange }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select time period" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="week">This Week</SelectItem>
      <SelectItem value="month">This Month</SelectItem>
      <SelectItem value="all">All Time</SelectItem>
    </SelectContent>
  </Select>
);

const Page = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    customers: 0,
    salesData: [],
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

  const getTimeFilter = () => {
    const now = new Date();
    let startDate;

    if (timePeriod === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timePeriod === "month") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      return "";
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = now.toISOString();

    return `&filters[createdAt][$gte]=${formattedStartDate}&filters[createdAt][$lte]=${formattedEndDate}`;
  };

  const processOrdersData = (orders) => {
    const statusCounts = {
      pending: 0,
      "in-process": 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };
    const salesByDate = {};
    const uniqueCustomers = new Set();

    const now = new Date();
    const daysToShow = timePeriod === "week" ? 7 : timePeriod === "month" ? 30 : 30;
    const dates = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    dates.forEach(date => {
      salesByDate[date] = {
        date,
        sales: 0,
        orders: 0
      };
    });

    orders.forEach((order) => {
      statusCounts[order.orderStatus]++;
      uniqueCustomers.add(order.user);

      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      if (salesByDate[orderDate]) {
        salesByDate[orderDate].sales += parseFloat(order.subtotal || 0);
        salesByDate[orderDate].orders += 1;
      }
    });

    return {
      orders: orders.slice(0, 5),
      totalOrders: orders.length,
      statusCounts,
      customers: uniqueCustomers.size,
      salesData: Object.values(salesByDate),
    };
  };

  const fetchStatusCounts = async (vendorId) => {
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
      toast.error("An unexpected error occurred");
    }
  };

  const fetchDashboardData = async (vendorId) => {
    setLoading(true);
    try {
      const timeFilter = getTimeFilter();
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendorId][$eq]=${vendorId}${timeFilter}&sort[0]=createdAt:desc&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!ordersRes.ok) {
        throw new Error("Unable to fetch order data");
      }

      const ordersData = await ordersRes.json();
      const orders = ordersData.data || [];
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setDashboardData(processOrdersData(orders));
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndVendorStatus = async () => {
      const user = getCookie("user");
      const jwt = getCookie("jwt");

      if (!user || !jwt) {
        toast.error("Please sign in to access your vendor dashboard");
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
          toast.error("Unable to retrieve vendor information");
          router.push("/become-a-vendor");
          return;
        }

        const vendorData = await vendorRes.json();
        if (!vendorData.data?.[0]?.documentId) {
          toast.error("Please complete your vendor registration");
          router.push("/become-a-vendor");
          return;
        }

        const vendorId = vendorData.data[0].documentId;
        await Promise.all([
          fetchStatusCounts(vendorId),
          fetchDashboardData(vendorId)
        ]);
      } catch (error) {
        toast.error("An unexpected error occurred");
        router.push("/become-a-vendor");
      }
    };

    checkAuthAndVendorStatus();
  }, [router, timePeriod]);

  if (loading) return <Loading />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-orange-600">${data.sales.toFixed(2)}</p>
          <p className="text-gray-600">{data.orders} orders</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <TimePeriodSelect value={timePeriod} onValueChange={setTimePeriod} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">
                  {timePeriod === "week"
                    ? statusCountsWeek.pending
                    : timePeriod === "month"
                      ? statusCountsMonth.pending
                      : statusCountsAll.pending}
                </h3>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 capitalize">
              {timePeriod === "week"
                ? "This Week"
                : timePeriod === "month"
                  ? "This Month"
                  : "All Time"}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">Customers</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">
                  {dashboardData.customers}
                </h3>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">All Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">
                  {dashboardData.totalOrders}
                </h3>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Pending</span>
              <span className="font-medium">
                {timePeriod === "week"
                  ? statusCountsWeek.pending
                  : timePeriod === "month"
                    ? statusCountsMonth.pending
                    : statusCountsAll.pending}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Completed</span>
              <span className="font-medium">
                {timePeriod === "week"
                  ? statusCountsWeek.delivered
                  : timePeriod === "month"
                    ? statusCountsMonth.delivered
                    : statusCountsAll.delivered}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-semibold">Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-orange-600 font-medium">Sales</span>
                <span className="text-sm text-gray-500 capitalize">
                  {timePeriod === "week"
                    ? "Last 7 Days"
                    : timePeriod === "month"
                      ? "Last 30 Days"
                      : "All Time"}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  const currentMonth = d.getMonth();

                  // Get the previous date to check if month changed
                  const prevDate = new Date(date);
                  prevDate.setDate(d.getDate() - 1);
                  const prevMonth = prevDate.getMonth();

                  // If month changed or it's the first date, show month
                  if (
                    currentMonth !== prevMonth ||
                    date === dashboardData.salesData[0]?.date
                  ) {
                    return d.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });
                  }

                  // Otherwise just show the day
                  return d.getDate().toString();
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="oklch(75% 0.183 55.934)" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link
              href="/vendor/order-management"
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              All
            </Link>
          </div>
          <div className="space-y-5">
            {dashboardData.orders.map((order) => (
              <div key={order.id} className="flex items-center gap-2">
                <div className="w-16 h-fit rounded overflow-hidden">
                  <img
                    src={order.dishes?.[0]?.image?.url || "/food.png"}
                    alt={order.dishes?.[0]?.name || "Food"}
                    className="w-full h-fit object-cover aspect-video"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    Order #{order.customerOrderId}
                  </h4>
                  <p className="text-gray-600">
                    ${parseFloat(order.subtotal).toFixed(2)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
