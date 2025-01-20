"use client";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaClipboardList, FaDollarSign } from "react-icons/fa";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async (vendorID) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[vendor_id][$eq]=${vendorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorData = async (email) => {
      setLoading(true);

      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error.message || "Error fetching vendor data.");
        } else {
          const vendorData = data.data[0];
          if (!vendorData) {
            router.push("/become-vendor");
          } else {
            fetchOrders(vendorData.documentId);
          }
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    const getCookie = (name) => {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    };

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    } else {
      fetchVendorData(storedUser);
    }
  }, [router]);

  useEffect(() => {
    setPendingOrders(
      orders.filter((order) => order.order_status === "pending")
    );
    setAcceptedOrders(
      orders.filter((order) => order.order_status === "accepted")
    );
    setCompletedOrders(
      orders.filter(
        (order) =>
          order.order_status === "completed" ||
          order.order_status === "cancelled" ||
          order.order_status === "declined"
      )
    );
  }, [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, order_status: newStatus } : order
      )
    );
  };

  const calculateTotal = (products) => {
    return products
      .reduce((total, product) => {
        return total + parseFloat(product.price) * product.quantity;
      }, 0)
      .toFixed(2);
  };
  if (loading) {
    return <Loading />;
  }

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
              <p className="text-3xl font-bold text-center">
                {completedOrders.length}
              </p>
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
                    {pendingOrders.map((order,index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.products.map((product,index) => (
                            <div key={index} className="flex items-center">
                              <img
                                src={product.image.url}
                                alt="food"
                                className="w-10 h-10 rounded-full object-cover mr-2"
                              />
                              {product.name}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${calculateTotal(order.products)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="px-2 py-1 font-bold text-white bg-yellow-400 rounded text-center">
                            {order.order_status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center flex-col space-y-2">
                          <button
                            className="px-2 py-1 font-bold text-white bg-green-400 rounded"
                            onClick={() =>
                              handleStatusChange(order.id, "accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="px-2 py-1 text-white font-bold bg-red-600 rounded"
                            onClick={() =>
                              handleStatusChange(order.id, "declined")
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
              {acceptedOrders.length === 0 ? (
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
                    {acceptedOrders.map((order,index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.products.map((product,index) => (
                            <div key={index} className="flex items-center">
                              <img
                                src={product.image.url}
                                alt="food"
                                className="w-10 h-10 rounded-full object-cover mr-2"
                              />
                              {product.name}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${calculateTotal(order.products)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="px-2 py-1 font-bold text-white bg-green-400 rounded text-center">
                            {order.order_status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center flex-col space-y-2">
                          <button
                            className="px-2 py-1 text-white font-bold bg-red-600 rounded mt-1"
                            onClick={() =>
                              handleStatusChange(order.id, "cancelled")
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
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
