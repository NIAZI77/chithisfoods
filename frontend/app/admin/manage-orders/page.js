"use client";
import Loading from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [declinedCancelledOrders, setDeclinedCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pendingPage, setPendingPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [declinedCancelledPage, setDeclinedCancelledPage] = useState(1);

  const ordersPerPage = 10;

  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error("No orders data found");
      }

      setOrders(data.data).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
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

  useEffect(() => {
    const storedAdmin = getCookie("admin");

    if (!storedAdmin) {
      router.push("/admin/login");
      return;
    } else {
      fetchOrders();
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
      orders.filter((order) => order.order_status === "fulfilled")
    );
    setDeclinedCancelledOrders(
      orders.filter(
        (order) =>
          order.order_status === "declined" ||
          order.order_status === "cancelled"
      )
    );
  }, [orders]);

  const calculateTotal = (products) => {
    return products
      .reduce((total, product) => {
        return total + parseFloat(product.price) * product.quantity;
      }, 0)
      .toFixed(2);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "cancelled":
      case "declined":
        return "bg-red-500";
      case "fulfilled":
      case "accepted":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-400";
      default:
        return "bg-gray-500";
    }
  };

  const getPaginatedOrders = (orders, page) => {
    const startIndex = (page - 1) * ordersPerPage;
    return orders.slice(startIndex, startIndex + ordersPerPage);
  };

  const loadMoreOrders = (category) => {
    if (category === "pending") {
      setPendingPage((prevPage) => prevPage + 1);
    } else if (category === "accepted") {
      setAcceptedPage((prevPage) => prevPage + 1);
    } else if (category === "fulfilled") {
      setCompletedPage((prevPage) => prevPage + 1);
    } else if (category === "declinedCancelled") {
      setDeclinedCancelledPage((prevPage) => prevPage + 1);
    }
  };

  const hasMoreOrders = (orders, page) => {
    return orders.length > page * ordersPerPage;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Orders</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DashboardCard
              title="Total Orders"
              count={orders.length}
              icon={<FaClipboardList />}
            />
            <DashboardCard
              title="Orders Served"
              count={completedOrders.length}
              icon={<FaClipboardList />}
            />
            <DashboardCard
              title="Pending Orders"
              count={pendingOrders.length}
              icon={<FaClipboardList />}
            />
          </div>

          <OrderSection
            title="Pending Orders"
            orders={getPaginatedOrders(pendingOrders, pendingPage)}
            calculateTotal={calculateTotal}
            getOrderStatusColor={getOrderStatusColor}
          />
          {hasMoreOrders(pendingOrders, pendingPage) && (
            <div className="mt-4 text-center">
              <button
                onClick={() => loadMoreOrders("pending")}
                className="bg-orange-500 text-white py-2 px-4 rounded"
              >
                View More
              </button>
            </div>
          )}

          <OrderSection
            title="Accepted Orders"
            orders={getPaginatedOrders(acceptedOrders, acceptedPage)}
            calculateTotal={calculateTotal}
            getOrderStatusColor={getOrderStatusColor}
          />
          {hasMoreOrders(acceptedOrders, acceptedPage) && (
            <div className="mt-4 text-center">
              <button
                onClick={() => loadMoreOrders("accepted")}
                className="bg-orange-500 text-white py-2 px-4 rounded"
              >
                View More
              </button>
            </div>
          )}

          <OrderSection
            title="Fulfilled Orders"
            orders={getPaginatedOrders(completedOrders, completedPage)}
            calculateTotal={calculateTotal}
            getOrderStatusColor={getOrderStatusColor}
          />
          {hasMoreOrders(completedOrders, completedPage) && (
            <div className="mt-4 text-center">
              <button
                onClick={() => loadMoreOrders("fulfilled")}
                className="bg-orange-500 text-white py-2 px-4 rounded"
              >
                View More
              </button>
            </div>
          )}

          <OrderSection
            title="Declined/Cancelled Orders"
            orders={getPaginatedOrders(
              declinedCancelledOrders,
              declinedCancelledPage
            )}
            calculateTotal={calculateTotal}
            getOrderStatusColor={getOrderStatusColor}
          />
          {hasMoreOrders(declinedCancelledOrders, declinedCancelledPage) && (
            <div className="mt-4 text-center">
              <button
                onClick={() => loadMoreOrders("declinedCancelled")}
                className="bg-orange-500 text-white py-2 px-4 rounded"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-lg font-bold space-x-2 flex items-center justify-center">
        {icon}
        {title}
      </p>
      <p className="text-3xl font-bold text-center">{count}</p>
    </div>
  );
};

const OrderSection = ({
  title,
  orders,
  calculateTotal,
  getOrderStatusColor,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <div className="overflow-auto p-4 max-h-screen">
        {orders.length === 0 ? (
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
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-100 transition-all my-2"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    <Link
                      href={`/admin/order/${order.cOrderID}`}
                      className="w-full h-full"
                    >
                      #{order.order_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    ${order.productTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    <div
                      className={`px-2 py-2 font-bold text-white rounded text-center ${getOrderStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status
                        .split(" ")
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() +
                            part.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
