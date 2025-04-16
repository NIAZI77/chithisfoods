"use client";

import React from "react";

export default function OrderHistoryPage() {
  const orderHistory = [
    {
      id: "11234",
      date: "28 Nov 2024, 8:28 PM",
      status: "in-process",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
    {
      id: "11235",
      date: "28 Nov 2024, 8:30 PM",
      status: "fulfilled",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
    {
      id: "11236",
      date: "28 Nov 2024, 8:31 PM",
      status: "fulfilled",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
    {
      id: "11237",
      date: "28 Nov 2024, 8:32 PM",
      status: "fulfilled",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
    {
      id: "11238",
      date: "28 Nov 2024, 8:33 PM",
      status: "in-process",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
    {
      id: "11239",
      date: "28 Nov 2024, 8:34 PM",
      status: "cancelled",
      items: [
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
        { name: "Food Name", desc: "Vegetables with rice", price: 5.0, qty: 1 },
      ],
    },
  ];

  const countByStatus = (status) =>
    orderHistory.filter((order) => order.status === status).length;

  const StatusBadge = ({ status }) => {
    const statusMap = {
      "in-process": "bg-yellow-100 text-yellow-800",
      fulfilled: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    const labelMap = {
      "in-process": "IN-PROCESS",
      fulfilled: "FULFILLED",
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

  return (
    <div className="p-6 w-[90%] mx-auto">
      <h2 className="text-xl font-semibold mb-4">ORDER STATUS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 place-items-center">
        <div className="bg-yellow-50 p-4 rounded shadow w-full">
          <div className="flex items-center gap-4">
            <img src="/a.png" alt="In Process" className="w-10 h-10" />
            <div>
              <div className="text-sm text-gray-600">Orders in Process</div>
              <div className="text-2xl font-bold">
                {countByStatus("in-process")}
              </div>
              <StatusBadge status="in-process" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded shadow w-full">
          <div className="flex items-center gap-4">
            <img src="/a.png" alt="Fulfilled" className="w-10 h-10" />
            <div>
              <div className="text-sm text-gray-600">Orders Fulfilled</div>
              <div className="text-2xl font-bold">
                {countByStatus("fulfilled")}
              </div>
              <StatusBadge status="fulfilled" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded shadow w-full">
          <div className="flex items-center gap-4">
            <img src="/a.png" alt="Cancelled" className="w-10 h-10" />
            <div>
              <div className="text-sm text-gray-600">Orders Cancelled</div>
              <div className="text-2xl font-bold">
                {countByStatus("cancelled")}
              </div>
              <StatusBadge status="cancelled" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">ORDER HISTORY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {orderHistory.map((order, idx) => {
          const total = order.items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
          );
          return (
            <div key={idx} className="bg-white p-4 rounded shadow space-y-2 w-full h-full">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500">{order.date}</p>
              <div className="space-y-2">
                {order.items.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img
                      src="/food.png"
                      alt="food"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-bold text-sm">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-500 underline cursor-pointer">
                See all
              </p>
              <div className="text-sm font-semibold">
                x{order.items.length} Items{" "}
                <span className="text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
