"use client";

import Loading from "@/app/loading";
import Custom404 from "@/app/not-found";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
      return;
    }

    const fetchVendorData = async (email, vendorID) => {
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
          toast.error(data.error.message || "Error fetching vendor data.");
          return;
        }
        const vendorData = data.data[0];
        if (vendorData.length === 0 || vendorData.documentId !== vendorID) {
          router.push("/");
        }
      } catch (error) {
        toast.error("Error fetching vendor data.");
        console.error(error);
      }
      setLoading(false);
    };

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          console.log("error fetching order");
          return;
        }

        const data = await response.json();
        setOrder(data.data);
        fetchVendorData(storedUser, data.data.vendor_id);
      } catch (error) {
        console.log("Error fetching order data:", error);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  const calculateTotal = () => {
    return order.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const updateOrderStatus = async (status) => {
    setSubmitting(true);
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
            },
          }),
        }
      );

      const updatedOrder = await response.json();
      if (response.ok) {
        setOrder(updatedOrder.data);
        toast.success(`Order ${status}`);
      } else {
        toast.error(updateOrder.error.message || "Error updating order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error(error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return <Custom404 />;
  }

  const total = calculateTotal();

  return (
    <div className="ml-0 md:ml-64 p-6 transition-padding duration-300">
      <ToastContainer />
      <div className="space-y-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-gray-800">
              Order #{order.order_id}
            </h3>
            <span
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
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                )
                .join(" ")}
            </span>
          </div>

          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Placed On</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Customer Name</span>{" "}
            {order.customer_name}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Email</span> {order.email}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-bold text-gray-800">Phone</span> {order.phone}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-bold text-gray-800">Delivery Address</span>{" "}
            {order.address}
          </p>
          {order.addressLine && (
            <p className="text-gray-600 mb-4">
              <span className="font-bold text-gray-800">
                Delivery Address Line
              </span>{" "}
              {order.addressLine}
            </p>
          )}
          {order.instruction && (
            <p className="text-gray-600 mb-4">
              <span className="font-bold text-gray-800">
                Delivery Instructions
              </span>{" "}
              {order.instruction}
            </p>
          )}

          <div className="border-t pt-4">
            <h4 className="font-semibold text-lg text-gray-800 mb-3">
              Ordered Items:
            </h4>
            <div>
              <ul className="space-y-4 flex items-center justify-between flex-wrap">
                {order.products.map((product, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 p-2 rounded-lg transition-all"
                  >
                    <img
                      src={product.image.url}
                      alt={product.name}
                      className="md:w-32 w-20 md:h-16 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Price: ${product.price * product.quantity}
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
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="font-bold text-lg text-gray-800">Total</p>
            <p className="text-xl text-gray-800">${total.toFixed(2)}</p>
          </div>
          {order.order_status.toLowerCase() === "pending" && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => updateOrderStatus("accepted")}
                disabled={submitting}
                className="px-8 py-2 disabled:bg-green-300 disabled:cursor-not-allowed bg-green-500 text-white rounded font-bold"
              >
                Accept
              </button>
              <button
                onClick={() => updateOrderStatus("declined")}
                disabled={submitting}
                className="px-8 py-2 disabled:bg-red-300 disabled:cursor-not-allowed bg-red-500 text-white rounded font-bold"
              >
                Decline
              </button>
            </div>
          )}
          {order.order_status.toLowerCase() === "accepted" && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => updateOrderStatus("declined")}
                disabled={submitting}
                className="px-8 py-2 disabled:bg-red-300 disabled:cursor-not-allowed bg-red-500 text-white rounded font-bold"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
