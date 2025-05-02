"use client";

import React, { useState } from "react";
import { ChevronDown, Package2, CheckCircle2, XCircle } from "lucide-react";
import * as Select from "@radix-ui/react-select";

const InProcessCard = () => (
  <div className="bg-yellow-100 rounded-lg p-4 md:p-6">
    <div className="flex items-center gap-4">
      <div className="text-yellow-700">
        <Package2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-3xl font-semibold">2</h3>
        <p className="text-sm font-medium text-yellow-700">
          Orders IN-PROCESS
        </p>
      </div>
    </div>
  </div>
);

const DeliveredCard = () => (
  <div className="bg-green-100 rounded-lg p-4 md:p-6">
    <div className="flex items-center gap-4">
      <div className="text-green-700">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-3xl font-semibold">2</h3>
        <p className="text-sm font-medium text-green-700">
          Orders DELIVERED
        </p>
      </div>
    </div>
  </div>
);

const CancelledCard = () => (
  <div className="bg-red-100 rounded-lg p-4 md:p-6">
    <div className="flex items-center gap-4">
      <div className="text-red-700">
        <XCircle className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-3xl font-semibold">2</h3>
        <p className="text-sm font-medium text-red-700">
          Orders CANCELLED
        </p>
      </div>
    </div>
  </div>
);

const orders = [
  {
    id: "11234",
    date: "28 Nov 2024, 8:28 PM",
    status: "IN-PROCESS",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
      {
        id: 2,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 2,
    totalPrice: 10.00,
  },
  {
    id: "11235",
    date: "28 Nov 2024, 8:28 PM",
    status: "DELIVERED",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 1,
    totalPrice: 5.00,
  },
  {
    id: "11236",
    date: "28 Nov 2024, 8:28 PM",
    status: "CANCELLED",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
      {
        id: 2,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 2,
    totalPrice: 10.00,
  },
  {
    id: "11237",
    date: "28 Nov 2024, 8:28 PM",
    status: "IN-PROCESS",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
      {
        id: 2,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
      {
        id: 3,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
      {
        id: 4,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 2,
    totalPrice: 10.00,
  },
  {
    id: "11238",
    date: "28 Nov 2024, 8:28 PM",
    status: "DELIVERED",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 1,
    totalPrice: 5.00,
  },
  {
    id: "11239",
    date: "28 Nov 2024, 8:28 PM",
    status: "CANCELLED",
    items: [
      {
        id: 1,
        name: "Food Name",
        description: "Vegetables with rice",
        price: 5.00,
        quantity: 1,
        image: "/food.png",
      },
    ],
    totalItems: 1,
    totalPrice: 5.00,
  },
];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    "IN-PROCESS": "bg-yellow-100 text-yellow-700",
    "DELIVERED": "bg-green-100 text-green-700",
    "CANCELLED": "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const StatusFilter = ({ value, onValueChange }) => {
  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: "in-process", label: "In-Process" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm bg-white border shadow-sm hover:bg-gray-50">
        <Select.Value placeholder="Filter by Status" />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border">
          <Select.Viewport>
            {filterOptions.map((option) => (
              <Select.Item 
                key={option.value} 
                value={option.value} 
                className="text-sm px-3 py-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer outline-none"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const OrderCard = ({ order }) => {
  const showSeeAll = order.items.length > 2;
  const displayItems = order.items.slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative min-h-[200px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-4 mb-16">
        {displayItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.name}</h4>
              <p className="text-sm text-gray-600 truncate">{item.description}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-red-500">${item.price.toFixed(2)}</span>
                <span className="text-gray-600">Qty: {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <span>×{order.totalItems} Items</span>
            <span className="text-red-500 font-medium">${order.totalPrice.toFixed(2)}</span>
          </div>
          <a 
            href={`/vendor/1234/${order.id}`} 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            See all
          </a>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status.toLowerCase() === statusFilter.replace("-", "").toUpperCase();
  });

  return (
    <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <InProcessCard />
        <DeliveredCard />
        <CancelledCard />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Order History</h2>
          <StatusFilter value={statusFilter} onValueChange={setStatusFilter} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredOrders.map((order, index) => (
            <OrderCard key={`${order.id}-${index}`} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
