"use client";

import Loading from "@/app/loading";
import Custom404 from "@/app/not-found";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    }
  }, [router]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[cOrderID][$eq]=${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Error fetching order");
        return;
      }

      const data = await response.json();
      setOrder(data.data);
    } catch (error) {
      console.log("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return <Custom404 />;
  }

  return (
    <div className="ml-0 md:ml-64 p-6 transition-padding duration-300">
      <div className="p-5 bg-gray-100">
        <div>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Placed On</span>{" "}
            {new Date(order[0].createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Customer Name</span>{" "}
            {order[0].customer_name}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-gray-800">Email</span>{" "}
            {order[0].email}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-bold text-gray-800">Phone</span>{" "}
            {order[0].phone}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-bold text-gray-800">Delivery Address</span>{" "}
            {order[0].address}
          </p>
          {order[0].addressLine && order[0].addressLine.length > 0 && (
            <p className="text-gray-600 mb-4">
              <span className="font-bold text-gray-800">
                Delivery Address Line
              </span>{" "}
              {order[0].addressLine}
            </p>
          )}
          {order[0].instruction && order[0].instruction.length > 0 && (
            <p className="text-gray-600 mb-4">
              <span className="font-bold text-gray-800">
                Delivery instructions
              </span>{" "}
              {order[0].instruction}
            </p>
          )}
        </div>
        {order.map((order, index) => (
          <div key={index}>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-xl">
                  By {order.products[0].vendor_name}
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
              <h4 className="font-semibold text-lg text-gray-800 mb-3 mt-6">
                Ordered Items:
              </h4>
              <ul className="space-y-4 flex items-center justify-around flex-wrap">
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
            </div>
          </div>
        ))}
        <p className="text-gray-600 my-8 border-t-2 pt-4">
          <span className="font-bold text-gray-800 text-2xl mr-4">Total</span> $
          {order[0].cTotal}(tax included)
        </p>
      </div>
    </div>
  );
};

export default Order;
