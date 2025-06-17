"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const TimePeriodSelector = ({ selectedPeriod, onPeriodChange }) => (
  <Select value={selectedPeriod} onValueChange={onPeriodChange}>
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

const DashboardPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (!AdminJWT || !AdminUser) {
      toast.error("Please login to continue.");
      router.push("/admin/login");
    }
  }, []);

  const getDateRangeFilter = useMemo(() => {
    const currentDate = new Date();
    let startDate;

    if (selectedTimePeriod === "week") {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
    } else if (selectedTimePeriod === "month") {
      startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 1);
    } else {
      return "";
    }

    return `&filters[createdAt][$gte]=${startDate.toISOString()}&filters[createdAt][$lte]=${currentDate.toISOString()}`;
  }, [selectedTimePeriod]);

  const dashboardMetrics = useMemo(
    () => ({
      totalMoneyReceived: orderData
        .reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0)
        .toFixed(2),
      orderCounts: {
        total: orderData.length.toString(),
        delivered: orderData
          .filter((order) => order.orderStatus === "delivered")
          .length.toString(),
        refunded: orderData
          .filter(
            (order) =>
              order.orderStatus === "refunded" ||
              order.orderStatus === "cancelled"
          )
          .length.toString(),
      },
    }),
    [orderData]
  );

  const getChartDateRange = useMemo(() => {
    const dates = [];
    const currentDate = new Date();
    const daysToDisplay = selectedTimePeriod === "week" ? 7 : 30;

    for (let i = daysToDisplay - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }, [selectedTimePeriod]);

  const chartData = useMemo(() => {
    const dailyData = getChartDateRange.reduce((acc, date) => {
      acc[date] = { date, orders: 0, totalMoney: 0, taxRevenue: 0 };
      return acc;
    }, {});

    orderData.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      if (dailyData[orderDate]) {
        dailyData[orderDate].orders += 1;
        dailyData[orderDate].totalMoney += parseFloat(order.totalAmount || 0);
        if (order.orderStatus === "delivered") {
          dailyData[orderDate].taxRevenue += parseFloat(order.tax || 0);
        }
      }
    });

    return Object.values(dailyData);
  }, [orderData, getChartDateRange]);

  const recentDeliveredOrders = useMemo(
    () =>
      orderData
        .filter((order) => order.orderStatus === "delivered")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orderData]
  );
  const recentCancelledOrders = useMemo(
    () =>
      orderData
        .filter((order) => order.orderStatus === "cancelled")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orderData]
  );

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?sort[0]=createdAt:desc${getDateRangeFilter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to retrieve order data. Please try again later."
          );
        }

        const { data } = await response.json();
        setOrderData(data || []);
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.error(
          error.message ||
            "Failed to load dashboard data. Please refresh the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [getDateRangeFilter]);

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const ordersForDate = orderData.filter(
      (order) => new Date(order.createdAt).toISOString().split("T")[0] === label
    );

    const deliveredCount = ordersForDate.filter(
      (order) => order.orderStatus === "delivered"
    ).length;

    const cancelledCount = ordersForDate.filter(
      (order) =>
        order.orderStatus === "cancelled" || order.orderStatus === "refunded"
    ).length;

    const totalMoney = ordersForDate.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount || 0),
      0
    );

    return (
      <div className="bg-white p-3 shadow-md rounded-lg border">
        <p className="font-medium">{label}</p>
        <p className="text-pink-600">${totalMoney.toFixed(2)}</p>
        <p className="text-green-600">Tax Revenue: ${data.taxRevenue.toFixed(2)}</p>
        <p className="text-gray-600">{ordersForDate.length} Orders</p>
        <p className="text-green-600">{deliveredCount} Delivered</p>
        <p className="text-red-600">{cancelledCount} Cancelled</p>
      </div>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto max-w-[2000px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <TimePeriodSelector
          selectedPeriod={selectedTimePeriod}
          onPeriodChange={setSelectedTimePeriod}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-gray-600 truncate">Total Money Received</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
                  ${dashboardMetrics.totalMoneyReceived}
                </h3>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
              <FaDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-gray-600 truncate">Total Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
                  {dashboardMetrics.orderCounts.total}
                </h3>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-pink-100 rounded-full flex-shrink-0 ml-2">
              <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-gray-600 truncate">Delivered Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
                  {dashboardMetrics.orderCounts.delivered}
                </h3>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-pink-100 rounded-full flex-shrink-0 ml-2">
              <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-gray-600 truncate">Refunded/Cancelled</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
                  {dashboardMetrics.orderCounts.refunded}
                </h3>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-pink-100 rounded-full flex-shrink-0 ml-2">
              <FaTimesCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-semibold">Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-medium">
                  Sales & Orders
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {selectedTimePeriod === "week"
                    ? "Last 7 Days"
                    : selectedTimePeriod === "month"
                    ? "Last 30 Days"
                    : "All Time"}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                      date === chartData[0].date
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
                <YAxis yAxisId="left" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke="#343434"
                  name="Orders"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalMoney"
                  stroke="#DB2777"
                  name="Total Money"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-semibold">Revenue Distribution</h3>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-medium">Daily Revenue</span>
                <span className="text-sm text-gray-500 capitalize">
                  {selectedTimePeriod === "week"
                    ? "Last 7 Days"
                    : selectedTimePeriod === "month"
                    ? "Last 30 Days"
                    : "All Time"}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-md rounded-lg border">
                        <p className="font-medium">{label}</p>
                        <p className="text-pink-600">Total: ${data.totalMoney.toFixed(2)}</p>
                        <p className="text-green-600">Tax Revenue: ${data.taxRevenue.toFixed(2)}</p>
                        <p className="text-gray-600">{data.orders} Orders</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="totalMoney" fill="#DB2777" name="Total Money" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Recent Delivered Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDeliveredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      @{order.vendorUsername}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Recent Cancelled Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCancelledOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      @{order.vendorUsername}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;