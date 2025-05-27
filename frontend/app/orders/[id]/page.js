"use client";
import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import {
  Flame,
  Package,
  Receipt,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  Truck,
} from "lucide-react";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PiBowlFood } from "react-icons/pi";

export default function OrderPage() {
  const { id: orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[customerOrderId][$eq]=${orderId}`,
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

      const { data } = await response.json();
      setOrderData(data);
    } catch (error) {
      setErrorMessage(
        error.message || "Failed to fetch order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderData?.length > 0) {
      const currentUser = getCookie("user");
      if (orderData[0].user !== currentUser) {
        setIsUnauthorized(true);
      }
    }
  }, [orderData]);

  if (isLoading) return <Loading />;

  if (isUnauthorized) {
    return (
      <div className="text-center mt-10">
        <p className="text-rose-500">
          You are not authorized to view this order.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center mt-10">
        <p className="text-rose-500">{errorMessage}</p>
      </div>
    );
  }

  if (!orderData?.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const orderSubtotal = orderData.reduce(
    (sum, order) => sum + order.subtotal,
    0
  );
  const totalDeliveryFee = orderData.reduce(
    (sum, order) => sum + (Number(order.vendorDeliveryFee) || 0),
    0
  );
  const currentOrder = orderData[0];

  return (
    <>
      <div
        className="h-64 md:h-72 relative mb-10 border-b-5 border-rose-500 -mt-28 bg-cover bg-no-repeat bg-bottom"
        style={{ backgroundImage: "url('/thankyoubg.png')" }}
      >
        <div className="absolute -bottom-6  left-[calc(50%-24px)] w-12 h-12 bg-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-extrabold">
          <Package size={24} />
        </div>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">
          Here are the details of your order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:px-12 px-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Receipt className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Order Number</span>
              <p className="text-black font-medium">
                {currentOrder.customerOrderId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Date of Order</span>
              <p className="text-black font-medium">
                {new Date(currentOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Recipient&apos;s Name</span>
              <p className="text-black font-medium">
                {currentOrder.customerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Delivery Address</span>
              <p className="text-black font-medium">{currentOrder.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Phone Number</span>
              <p className="text-black font-medium">{currentOrder.phone}</p>
            </div>
          </div>
          {currentOrder.note.length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="text-gray-500" size={20} />
              <div>
                <span className="text-gray-500">Note</span>
                <p className="text-black font-medium">{currentOrder.note}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow h-fit">
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <FaShoppingBag className="text-gray-500" size={20} />
              <span>Sub Total</span>
            </div>
            <span className="font-semibold">${orderSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <HiOutlineReceiptTax className="text-gray-500" size={20} />
              <span>Tax</span>
            </div>
            <span className="font-semibold">
              ${currentOrder.totalTax.toFixed(2)}
            </span>
          </div>
          {/* Per-vendor delivery fees */}
          {orderData.some(order => order.vendorDeliveryFee && order.storeName) && (
            <div className="mb-2">
              {orderData.map((order, idx) => (
                order.vendorDeliveryFee && order.storeName ? (
                  <div
                    key={order.vendorId || idx}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {order.storeName}
                    </span>
                    <span>${Number(order.vendorDeliveryFee).toFixed(2)}</span>
                  </div>
                ) : null
              ))}
            </div>
          )}
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <Truck className="text-gray-500" size={20} />
              <span>Delivery</span>
            </div>
            <span className="font-semibold">
              ${totalDeliveryFee.toFixed(2)}
            </span>
          </div>
  
          <div className="flex justify-between border-t mt-2 pt-3 text-lg font-bold">
            <div className="flex items-center gap-2">
              <LuSquareSigma className="text-gray-500" size={20} />
              <span>Total</span>
            </div>
            <span>${currentOrder.orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 md:px-12 px-4">
        <h2 className="text-gray-600 mb-4 text-lg font-bold flex items-center gap-2">
          <FaShoppingBag size={20} />
          Ordered Items
        </h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {orderData.map((order) =>
            order.dishes.map((dish, index) => (
              <div
                key={`${order.id}-${index}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 w-full">
                  <Image
                    fill
                    src={dish.image?.url || "/food.png"}
                    alt={dish.name}
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 capitalize text-lg">
                      {dish.name}
                    </h3>
                    <p className="text-rose-600 font-bold text-lg">
                      ${dish.total}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaShoppingBag size={14} /> Qty: {dish.quantity}
                    </span>
                    {dish.selectedSpiciness && (
                      <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full flex items-center gap-1">
                        <Flame size={14} /> {dish.selectedSpiciness}
                      </span>
                    )}
                  </div>

                  {(dish.toppings?.length > 0 || dish.extras?.length > 0) && (
                    <div className="space-x-2 space-y-1 pt-2 border-t border-gray-100 flex">
                      {dish.toppings?.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {dish.toppings.map((topping, idx) => (
                              <span
                                key={idx}
                                className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-sm"
                              >
                                <Image src={"/toppings.png"} alt="Topping" width={14} height={14} className="w-3 h-3 scale-175" /> {topping.name} (${topping.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {dish.extras?.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {dish.extras.map((extra, idx) => (
                              <span
                                key={idx}
                                className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-sm"
                              >
                                <Image src={"/extras.png"} alt="Extra" width={14} height={14} className="w-3 h-3 scale-125" /> {extra.name} (${extra.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/vendors/@${order.vendorUsername}`}
                    className="text-sm text-gray-500 transition-colors flex items-center gap-1"
                  >
                    <FaStore size={14} /> From:{" "}
                    <span className="font-bold hover:underline hover:text-rose-600 ">
                      @{order.vendorUsername}
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
