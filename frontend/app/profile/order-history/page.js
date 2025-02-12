"use client";

import Loading from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();
  function groupOrdersByCOrderID(orders) {
    const groupedOrders = {};

    orders.forEach((order) => {
      const cOrderID = order.cOrderID;
      if (!groupedOrders[cOrderID]) {
        groupedOrders[cOrderID] = [];
      }
      groupedOrders[cOrderID].push(order);
    });
    return Object.values(groupedOrders);
  }
  useEffect(() => {
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
    }
    const fetchOrders = async () => {
      setLoading(true);
      const email = getCookie("user");
      if (!email) return;

      const encodedEmail = encodeURIComponent(email);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[email][$eq]=${encodedEmail}`,
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

        setOrders(groupOrdersByCOrderID(data.data));
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  const updateOrderStatus = async (orderId, status) => {
    const cnfrm = confirm("Are you sure you want to cancel this order?");
    if (cnfrm) {
      var reason = prompt("Please provide a reason for canceling the order:");
      if (!reason) {
        toast.error("A reason is required to cancel the order.");
        return;
      }
    } else {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              order_status: status,
              reason,
            },
          }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === updatedOrder.data.order_id
              ? updatedOrder.data
              : order
          )
        );
        toast.success(`Order ${status}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error updating order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error(error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-[95%] mx-auto p-6 bg-white lg mt-8">
      <h2 className="md:text-2xl text-xl font-semibold text-gray-800 mb-6">
        Order History
      </h2>
      {orders.length === 0 ? (
        <p className="text-lg text-center text-gray-500">
          You have no past orders.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((odr, index) => (
            <div key={index} className="p-5 bg-gray-100">
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold text-gray-800">Placed On</span>{" "}
                  {new Date(odr[0].createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold text-gray-800">Customer Name</span>{" "}
                  {odr[0].customer_name}
                </p>
                {odr[0].email && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-bold text-gray-800">Email</span>{" "}
                    {odr[0].email}
                  </p>
                )}
                <p className="text-gray-600 mb-4">
                  <span className="font-bold text-gray-800">Phone</span>{" "}
                  {odr[0].phone}
                </p>
                {odr[0].address && odr[0].orderType == "delivery" && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-bold text-gray-800">
                      Delivery Address
                    </span>{" "}
                    {odr[0].address}
                  </p>
                )}
                {odr[0].addressLine && odr[0].addressLine.length > 0 && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-bold text-gray-800">
                      Delivery Address Line
                    </span>{" "}
                    {odr[0].addressLine}
                  </p>
                )}
                {odr[0].instruction && odr[0].instruction.length > 0 && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-bold text-gray-800">
                      Delivery instructions
                    </span>{" "}
                    {odr[0].instruction}
                  </p>
                )}
                {odr[0].orderType !== "delivery" && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-bold text-gray-800">
                      Vendor Address:{" "}
                    </span>
                    The vendor&apos;s address is mentioned in their profile.
                  </p>
                )}

                <p className="text-gray-600 mb-4 text-center text-xl font-bold">
                  {odr[0].orderType}
                </p>
              </div>
              {odr.map((order, index) => (
                <div key={index}>
                  <div className="border-t pt-4">
                    {" "}
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-xl hover:underline">
                        <Link href={`/vendors/${order.vendor_id}`}>
                          {" "}
                          By {order.vendor_name}
                        </Link>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          order.order_status === "pending"
                            ? "bg-yellow-300 text-yellow-800"
                            : "bg-green-300 text-green-800"
                        }`}
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
                    </div>
                    {(order.order_status === "cancelled" ||
                      order.order_status === "declined") && (
                      <p className="mb-4 text-xl flex items-center justify-center flex-col text-center">
                        <span className="font-bold text-center">
                          {order.order_status} Reason <br />
                        </span>{" "}
                        <span className="inline-block bg-red-500 px-4 py-1 rounded-full font-bold text-white">
                          {order.reason}
                        </span>
                      </p>
                    )}
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 mt-6">
                      Ordered Items:
                    </h4>
                    <ul className="space-y-4 flex items-center justify-around flex-wrap">
                      {order.products.map((product, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-4 p-2 rounded-lg transition-all"
                        >
                          <Image
                            height={100}
                            width={100}
                            src={product.image.url}
                            alt={product.name}
                            className="md:w-32 w-20 md:h-16 h-10 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-700">
                              {product.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Price: ${product.price}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Quantity: {product.quantity}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Spiciness: {product.selectedSpiciness}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-600 my-2">
                      <span className="font-bold text-gray-800 text-lg mr-2">
                        Products Total
                      </span>
                      ${order.productTotal}
                    </p>
                    <p className="text-gray-600 my-2">
                      <span className="font-bold text-gray-800 text-lg mr-2">
                        {" "}
                        Products Total (tax included)
                      </span>
                      ${order.totalWithTax}
                    </p>
                    {order.order_status.toLowerCase() === "pending" && (
                      <div>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.documentId, "cancelled")
                          }
                          className="px-8 py-2 bg-red-500 text-white rounded font-bold mx-auto disabled:bg-red-300 mb-10"
                          disabled={cancelling}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {order.order_status.toLowerCase() === "accepted" && (
                      <div>
                        <button
                          onClick={() => {
                            const conf = confirm("order Received?");
                            if (conf) {
                              updateOrderStatus(order.documentId, "fulfilled");
                            }
                          }}
                          className="px-8 py-2 bg-green-500 text-white rounded font-bold mx-auto mb-10"
                          disabled={cancelling}
                        >
                          Order Received
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <p className="text-gray-600 my-8 border-t-2 pt-4">
                <span className="font-bold text-gray-800 text-2xl mr-4">
                  Total
                </span>{" "}
                ${odr[0].cTotal}(tax included)
              </p>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderHistory;
