"use client";
import React, { useState, useEffect } from "react";
import { FaClipboardList, FaDollarSign } from "react-icons/fa";

const Dashboard = () => {
  const recentComplaints = [
    { name: "Wilder Scott", time: "1 day ago" },
    { name: "Kingsley Alvin", time: "1 day ago" },
    { name: "Tatum Lewis", time: "1 day ago" },
    { name: "Huxley Devon", time: "1 day ago" },
    { name: "Fletcher Trey", time: "1 day ago" },
    { name: "Mitchell Alden", time: "1 day ago" },
  ];

  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      const newOrders = [
        {
          id: "#25896",
          customer: "Jefferson Clay",
          food: {
            name: "Chicken Burger",
            image: "https://via.placeholder.com/150",
          },
          price: "$11.00",
          status: "Accepted",
        },
        {
          id: "#27856",
          customer: "Langston Lee",
          food: {
            name: "Pizza Chicken Bake",
            image: "https://via.placeholder.com/150",
          },
          price: "$50.00",
          status: "Pending",
        },
        {
          id: "#27857",
          customer: "Bronson Joe",
          food: {
            name: "Something Else",
            image: "https://via.placeholder.com/150",
          },
          price: "$68.00",
          status: "Declined", // Changed to Declined for testing
        },
        {
          id: "#27858",
          customer: "Fletcher Trey",
          food: {
            name: "Veggie Burger",
            image: "https://via.placeholder.com/150",
          },
          price: "$35.00",
          status: "Completed", // Added Completed Order
        },
      ];

      setOrders(newOrders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setPendingOrders(orders.filter((order) => order.status === "Pending"));
    setAcceptedOrders(orders.filter((order) => order.status === "Accepted"));
    setCompletedOrders(
      orders.filter(
        (order) =>
          order.status === "Completed" ||
          order.status === "Cancelled" ||
          order.status === "Declined"
      )
    );
  }, [orders]); // Only run when orders state changes

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-lg font-bold space-x-1 flex items-center justify-center">
                <FaClipboardList className="inline-block pr-1 mr-2 text-gray-600" />
                Online Orders
              </p>
              <p className="text-3xl font-bold text-center">1428</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-lg font-bold space-x-1 flex items-center justify-center">
                <FaClipboardList className="inline-block pr-1 mr-2 text-gray-600" />
                Orders Served
              </p>
              <p className="text-3xl font-bold text-center">{completedOrders.length}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-lg font-bold space-x-1 flex items-center justify-center">
                <FaClipboardList className="inline-block pr-1 mr-2 text-gray-600" />
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-center">
                {pendingOrders.length}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-lg font-medium space-x-1 flex items-center justify-center">
                <FaDollarSign className="inline-block pr-1 mr-2 text-gray-600" />
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-center">$1428</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-medium mb-2">Pending Orders</h2>
            <div className="overflow-auto p-4 max-h-screen">
              {pendingOrders.length === 0 ? (
                <p className="text-center text-gray-500">No Pending Orders</p>
              ) : (
                <table className="min-w-full table-auto divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Food
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200">
                    {pendingOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <img
                              src={order.food.image}
                              alt="food"
                              className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                            {order.food.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="px-2 py-1 font-bold text-white bg-yellow-400 rounded text-center">
                            Pending
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center flex-col space-y-2">
                          <button
                            className="px-2 py-1 font-bold text-white bg-green-400 rounded"
                            onClick={() =>
                              handleStatusChange(order.id, "Accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="px-2 py-1 text-white font-bold bg-red-600 rounded"
                            onClick={() =>
                              handleStatusChange(order.id, "Declined")
                            }
                          >
                            Decline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-medium mb-2">Accepted Orders</h2>
            <div className="overflow-auto p-4 max-h-screen">
              {completedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No Orders</p>
              ) : (
                <table className="min-w-full table-auto divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Food
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200">
                    {acceptedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <img
                              src={order.food.image}
                              alt="food"
                              className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                            {order.food.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="px-2 py-1 font-bold text-white bg-green-400 rounded text-center">
                            {order.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center flex-col space-y-2">
                          <button
                            className="px-2 py-1 text-white font-bold bg-red-600 rounded mt-1"
                            onClick={() =>
                              handleStatusChange(order.id, "Cancelled")
                            }
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-medium mb-2">Completed Orders</h2>
            <div className="overflow-auto p-4 max-h-screen">
              {completedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No Orders</p>
              ) : (
                <table className="min-w-full table-auto divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Food
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200">
                    {completedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <img
                              src={order.food.image}
                              alt="food"
                              className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                            {order.food.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="px-2 py-1 font-bold text-white bg-green-400 rounded text-center">
                            {order.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center flex-col space-y-2"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
