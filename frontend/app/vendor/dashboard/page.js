"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ShoppingCart, Users, Package, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "#f3f4f6",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const salesData = {
  labels: ["Sept 10", "Sept 11", "Sept 12", "Sept 13", "Sept 14", "Sept 15", "Sept 16"],
  datasets: [
    {
      data: [45, 62, 65, 30, 22, 40, 50],
      backgroundColor: "#ff4f00",
      borderRadius: 8,
    },
  ],
};

const recentOrders = [
  {
    id: 1,
    foodName: "Food Name",
    price: 5.00,
    date: "12 Sept 2022",
    status: "Pending",
    image: "/food.png",
  },
  {
    id: 2,
    foodName: "Food Name",
    price: 5.00,
    date: "12 Sept 2022",
    status: "Completed",
    image: "/food.png",
  },
  {
    id: 3,
    foodName: "Food Name",
    price: 5.00,
    date: "12 Sept 2022",
    status: "Pending",
    image: "/food.png",
  },
  {
    id: 4,
    foodName: "Food Name",
    price: 5.00,
    date: "12 Sept 2022",
    status: "Completed",
    image: "/food.png",
  },
];

const TimePeriodSelect = ({ value, onValueChange }) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm bg-white border shadow-sm hover:bg-gray-50">
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border">
          <Select.Viewport>
            <Select.Item value="week" className="text-sm px-3 py-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer outline-none">
              <Select.ItemText>This Week</Select.ItemText>
            </Select.Item>
            <Select.Item value="month" className="text-sm px-3 py-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer outline-none">
              <Select.ItemText>This Month</Select.ItemText>
            </Select.Item>
            <Select.Item value="all" className="text-sm px-3 py-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer outline-none">
              <Select.ItemText>All Time</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const Page = () => {
  const [timePeriod, setTimePeriod] = useState("week");

  return (
    <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <TimePeriodSelect value={timePeriod} onValueChange={setTimePeriod} />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Abandoned Cart Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">Abandoned Cart</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">20%</h3>
                <span className="text-green-500 text-sm">+0.00%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 capitalize">
              {timePeriod === 'week' ? 'This Week' : timePeriod === 'month' ? 'This Month' : 'All Time'}
            </span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">Customers</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">30</h3>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">1,180</span>
              <span className="text-red-500 text-sm">-4.90%</span>
            </div>
          </div>
        </div>

        {/* All Orders Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">All Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">345</h3>
                <span className="text-green-500 text-sm">+0.00%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Pending</span>
              <span className="font-medium">112</span>
              <span className="text-green-500">+0.00%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Completed</span>
              <span className="font-medium">876</span>
              <span className="text-orange-500">+0.00%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-semibold">Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-orange-600 font-medium">Sales</span>
                <span className="text-sm text-gray-500 capitalize">
                  {timePeriod === 'week' ? 'Last 7 Days' : timePeriod === 'month' ? 'Last 30 Days' : 'All Time'}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <Bar options={chartOptions} data={salesData} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Recent Orders</h3>
            <button className="text-sm text-gray-500">All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.foodName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{order.foodName}</h4>
                  <p className="text-gray-600">${order.price.toFixed(2)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <span
                    className={`text-sm px-2 py-0.5 rounded-full ${
                      order.status === "Pending"
                        ? "text-yellow-600 bg-yellow-200" 
                        : "text-green-600 bg-green-200"
                    }`}
                  >
                    {order.status}
                  </span>
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
