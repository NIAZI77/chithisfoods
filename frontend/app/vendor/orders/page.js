"use client";
import Pagination from "@/app/components/pagination";
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
  const [loading, setLoading] = useState(true);
  const [pendingPage, setPendingPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const ordersPerPage = 10;
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
        setOrders(
          data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
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

  const calculateTotal = (products) => {
    return products
      .reduce((total, product) => {
        return total + parseFloat(product.price) * product.quantity;
      }, 0)
      .toFixed(2);
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
    } else if (category === "completed") {
      setCompletedPage((prevPage) => prevPage + 1);
    }
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
          />
          {pendingOrders.length > 10 && (
            <Pagination
              currentPage={pendingPage}
              totalPages={Math.ceil(pendingOrders.length / ordersPerPage)}
              onPageChange={(page) => setPendingPage(page)}
            />
          )}
          <OrderSection
            title="Accepted Orders"
            orders={getPaginatedOrders(acceptedOrders, acceptedPage)}
            calculateTotal={calculateTotal}
          />

          {acceptedOrders.length > 10 && (
            <Pagination
              currentPage={acceptedPage}
              totalPages={Math.ceil(acceptedOrders.length / ordersPerPage)}
              onPageChange={(page) => setAcceptedPage(page)}
            />
          )}
          <OrderSection
            title="Fulfilled Orders"
            orders={getPaginatedOrders(completedOrders, completedPage)}
            calculateTotal={calculateTotal}
          />

          {completedOrders.length > 10 && (
            <Pagination
              currentPage={completedPage}
              totalPages={Math.ceil(completedOrders.length / ordersPerPage)}
              onPageChange={(page) => setCompletedPage(page)}
            />
          )}
        </div>
      </div>
    </main>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-lg font-bold space-x-1 flex items-center justify-center">
        {icon}
        {title}
      </p>
      <p className="text-3xl font-bold text-center">{count}</p>
    </div>
  );
};

// Order Section Component
const OrderSection = ({ title, orders, calculateTotal }) => {
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
                  Food
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
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-all my-2"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/vendor/order/${order.documentId}`}
                      className="w-full h-full"
                    >
                      #{order.order_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center my-2">
                        <Image
                          height={100}
                          width={100}
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
