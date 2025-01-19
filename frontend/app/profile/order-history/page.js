"use client";

import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
    } else {
      setEmail(storedUser);
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
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [router]);
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="md:w-[80%] w-[90%] mx-auto p-6 bg-white lg mt-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Order History
      </h2>
      {orders.length === 0 ? (
        <p className="text-lg text-center text-gray-500">
          You have no past orders.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="p-5 bg-gray-100">
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
                  {order.order_status}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-bold text-gray-800"> Placed On</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold text-gray-800">
                  {" "}
                  Customer Name
                </span>{" "}
                {order.customer_name}
              </p>
              <p className="text-gray-600 mb-2">
                {" "}
                <span className="font-bold text-gray-800"> Email</span>{" "}
                {order.email}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-bold text-gray-800"> Phone</span>{" "}
                {order.phone}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-bold text-gray-800">
                  {" "}
                  Delivery Address
                </span>{" "}
                {order.address}
              </p>
              {order.addressLine.length > 0 && (
                <p className="text-gray-600 mb-4">
                  <span className="font-bold text-gray-800">
                    {" "}
                    Delivery Address Line
                  </span>{" "}
                  {order.addressLine}
                </p>
              )}
              {order.instruction.length > 0 && (
                <p className="text-gray-600 mb-4">
                  <span className="font-bold text-gray-800">
                    {" "}
                    Delivery instructions
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
