"use client";
import Loading from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ThankYouPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrderByCustomerId = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[customerOrderId][$eq]=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch order");
      }

      const data = await response.json();
      setOrders(data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to fetch order. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderByCustomerId(id);
    }
  }, [id]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  // Calculate total amounts
  const totalSubtotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalTax = orders.reduce((sum, order) => sum + order.tax, 0);
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <>
      {/* Header */}
      <div
        className="h-64 md:h-72 relative mb-10 border-b-5 border-rose-500 -mt-28 bg-cover bg-no-repeat bg-bottom"
        style={{ backgroundImage: "url('/thankyoubg.png')" }}
      >
        <div className="absolute -bottom-6  left-[calc(50%-24px)] w-12 h-12 bg-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-extrabold">
          ✓
        </div>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mt-2">
          Your order has been successfully placed.
        </p>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:px-12 px-4">
        <div className="space-y-3">
          <div>
            <span className="text-gray-500">Order Number</span>
            <p className="text-black font-medium">
              {orders[0].customerOrderId}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Date of Order</span>
            <p className="text-black font-medium">
              {new Date(orders[0].createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Recipient&apos;s Name</span>
            <p className="text-black font-medium">{orders[0].customerName}</p>
          </div>
          <div>
            <span className="text-gray-500">Delivery Address</span>
            <p className="text-black font-medium">{orders[0].address}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone Number</span>
            <p className="text-black font-medium">{orders[0].phone}</p>
          </div>
          {orders[0].note.length > 0 && (
            <div>
              <span className="text-gray-500">Note</span>
              <p className="text-black font-medium">{orders[0].note}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow h-fit">
          <div className="flex justify-between py-2">
            <span>Sub Total</span>
            <span className="font-semibold">${totalSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax</span>
            <span className="font-semibold">${totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t mt-2 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-10 md:px-12 px-4">
        <h2 className="text-gray-600 mb-4 text-lg font-bold">Items</h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {orders.map((order) =>
            order.dishes.map((dish, index) => (
              <div
                key={`${order.id}-${index}`}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Image
                  width={100}
                  height={100}
                  src={dish.image?.url || "/food.png"}
                  alt={dish.name}
                  className="w-20 h-auto object-cover rounded aspect-video"
                />
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {dish.name}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {dish.quantity}</p>
                  {dish.selectedSpiciness && (
                    <p className="text-sm text-gray-500">
                      Spiciness: {dish.selectedSpiciness}
                    </p>
                  )}
                  {dish.toppings && dish.toppings.length > 0 && (
                    <div className="text-sm text-gray-500">
                      <strong className="font-bold">Toppings</strong>
                      <ul className="list-disc list-inside">
                        {dish.toppings.map((topping, idx) => (
                          <li key={idx}>{topping.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dish.extras && dish.extras.length > 0 && (
                    <div className="text-sm text-gray-500">
                      <strong className="font-bold">Extras</strong>
                      <ul className="list-disc list-inside">
                        {dish.extras.map((extra, idx) => (
                          <li key={idx}>{extra.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={order.vendorUsername}
                    className="text-sm text-gray-500"
                  >
                    From:{" "}
                    <span className="hover:text-rose-600 hover:underline transition-all">
                      @{order.vendorUsername}
                    </span>
                  </Link>
                  <p className="text-rose-600 font-bold">${dish.total}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
