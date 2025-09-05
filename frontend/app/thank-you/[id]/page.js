"use client";
import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import {
  Flame,
  Package,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  Truck,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PiBowlFood } from "react-icons/pi";

const OrderStatusBadge = ({ status }) => {
  return (
    <p
      className={`w-24 rounded-full py-1 flex items-center justify-center capitalize
        ${status === "delivered" && "bg-slate-100 text-slate-700"}
        ${status === "ready" && "bg-green-100 text-green-700"}
        ${status === "pending" && "bg-yellow-100 text-yellow-700"}
        ${status === "in-process" && "bg-indigo-100 text-indigo-700"}
        ${status === "cancelled" && "bg-red-100 text-red-700"}
        text-center text-sm font-semibold`}
    >
      {status}
    </p>
  );
};

const VendorOrderGroup = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        {order.vendorUsername && order.vendorUsername.trim() !== "" && (
          <div className="flex items-center gap-2">
            <FaStore className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              @{order.vendorUsername}
            </h3>
          </div>
        )}
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {order.dishes.map((dish, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            {dish.image?.url && dish.image.url.trim() !== "" && (
              <div className="relative h-fit w-16 aspect-video flex-shrink-0">
                <img
                  src={dish.image.url}
                  alt={dish.name}
                  className="object-cover rounded-md h-fit w-16 aspect-video"
                />
              </div>
            )}
            <div className="flex-grow space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                {dish.name && dish.name.trim() !== "" && (
                  <h4 className="font-medium text-gray-800 capitalize text-base sm:text-lg">
                    {dish.name}
                  </h4>
                )}
                {dish.total && Number(dish.total) > 0 && (
                  <p className="text-rose-600 font-semibold text-base sm:text-lg">
                    ${dish.total}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                {dish.quantity && Number(dish.quantity) > 0 && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" /> Qty:{" "}
                    {dish.quantity}
                  </span>
                )}
                {dish.selectedSpiciness &&
                  dish.selectedSpiciness.trim() !== "" && (
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                      {dish.selectedSpiciness}
                    </span>
                  )}
              </div>
              {(() => {
                const validToppings =
                  (dish.toppings || []).filter(
                    (topping) => topping && topping.name && topping.price !== undefined && topping.price !== null && !isNaN(Number(topping.price))
                  ) || [];
                const validExtras =
                  (dish.extras || []).filter(
                    (extra) => extra && extra.name && extra.price !== undefined && extra.price !== null && !isNaN(Number(extra.price))
                  ) || [];
                return validToppings.length > 0 || validExtras.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {validToppings.map((topping, idx) => (
                      <span
                        key={idx}
                        className="bg-pink-100 px-2 py-0.5 rounded-full text-pink-700 text-xs sm:text-sm flex items-center gap-1"
                      >
                        <img
                          src={"/toppings.png"}
                          alt="Topping"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {topping.name} (${Number(topping.price).toFixed(2)})
                      </span>
                    ))}
                    {validExtras.map((extra, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 px-2 py-0.5 rounded-full text-green-700 text-xs sm:text-sm flex items-center gap-1"
                      >
                        <img
                          src={"/extras.png"}
                          alt="Extra"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {extra.name} (${Number(extra.price).toFixed(2)})
                      </span>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ThankYouPage() {
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3 capitalize text-rose-600">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to view this order. This order belongs to
            another user account.
          </p>
          <div className="space-y-3">
            <Link
              href="/profile/order-history"
              className="inline-block px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View My Orders
            </Link>
            <div>
              <Link
                href="/"
                className="text-rose-600 hover:text-rose-700 underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Error Loading Order
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <button
              onClick={() => fetchOrderDetails(orderId)}
              className="px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try Again
            </button>
            <div>
              <Link
                href="/profile/order-history"
                className="inline-block px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Package className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3 capitalize text-rose-600">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find an order with the ID{" "}
            <strong>{orderId}</strong>. Please check the order number and try
            again.
          </p>
          <div className="space-y-3">
            <Link
              href="/profile/order-history"
              className="inline-block px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View My Orders
            </Link>
            <div>
              <Link
                href="/"
                className="text-rose-600 hover:text-rose-700 underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
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
        <div className="absolute -bottom-6 left-[calc(50%-24px)] w-12 h-12 bg-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-extrabold">
          <PiBowlFood size={24} />
        </div>
      </div>
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Your order has been successfully placed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10 px-4 sm:px-6 md:px-12">
        <div className="space-y-3 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          {currentOrder.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <span className="text-gray-500 text-sm sm:text-base">
                  Date of Order
                </span>
                <p className="text-black font-medium text-sm sm:text-base">
                  {new Date(currentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          {currentOrder.deliveryDate &&
            currentOrder.deliveryDate.trim() !== "" && (
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <span className="text-gray-500 text-sm sm:text-base">
                    Delivery Date
                  </span>
                  <p className="text-black font-medium text-sm sm:text-base">
                    {new Date(currentOrder.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          {currentOrder.deliveryTime &&
            currentOrder.deliveryTime.trim() !== "" && (
              <div className="flex items-center gap-2">
                <Clock className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <span className="text-gray-500 text-sm sm:text-base">
                    Delivery Time
                  </span>
                  <p className="text-black font-medium text-sm sm:text-base">
                    {new Date(
                      `2000-01-01T${currentOrder.deliveryTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          {currentOrder.customerName &&
            currentOrder.customerName.trim() !== "" && (
              <div className="flex items-center gap-2">
                <User className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <span className="text-gray-500 text-sm sm:text-base">
                    Recipient&apos;s Name
                  </span>
                  <p className="text-black font-medium text-sm sm:text-base">
                    {currentOrder.customerName}
                  </p>
                </div>
              </div>
            )}
          {currentOrder.address && currentOrder.address.trim() !== "" && (
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <span className="text-gray-500 text-sm sm:text-base">
                  Delivery Address
                </span>
                <p className="text-black font-medium text-sm sm:text-base">
                  {currentOrder.address}
                </p>
              </div>
            </div>
          )}
          {currentOrder.phone && currentOrder.phone.trim() !== "" && (
            <div className="flex items-center gap-2">
              <Phone className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <span className="text-gray-500 text-sm sm:text-base">
                  Phone Number
                </span>
                <p className="text-black font-medium text-sm sm:text-base">
                  {currentOrder.phone}
                </p>
              </div>
            </div>
          )}
          {currentOrder.note && currentOrder.note.trim().length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <span className="text-gray-500 text-sm sm:text-base">Note</span>
                <p className="text-black font-medium text-sm sm:text-base">
                  {currentOrder.note}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 sm:p-6 rounded-xl shadow-sm h-fit">
          {orderSubtotal > 0 && (
            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <FaShoppingBag className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Sub Total</span>
              </div>
              <span className="font-semibold text-sm sm:text-base">
                ${orderSubtotal.toFixed(2)}
              </span>
            </div>
          )}
          {currentOrder.totalTax && Number(currentOrder.totalTax) > 0 && (
            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <HiOutlineReceiptTax className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Tax</span>
              </div>
              <span className="font-semibold text-sm sm:text-base">
                ${currentOrder.totalTax.toFixed(2)}
              </span>
            </div>
          )}
          {orderData.some(
            (order) =>
              order.vendorDeliveryFee &&
              Number(order.vendorDeliveryFee) > 0 &&
              order.vendorUsername
          ) && (
            <div className="mb-2">
              {orderData.map((order, idx) =>
                order.vendorDeliveryFee &&
                Number(order.vendorDeliveryFee) > 0 &&
                order.vendorUsername ? (
                  <div
                    key={order.vendorId || idx}
                    className="flex justify-between text-sm text-gray-700 py-1"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />@{order.vendorUsername}
                    </span>
                    <span>${Number(order.vendorDeliveryFee).toFixed(2)}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
          {totalDeliveryFee > 0 && (
            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Truck className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Delivery</span>
              </div>
              <span className="font-semibold text-sm sm:text-base">
                ${totalDeliveryFee.toFixed(2)}
              </span>
            </div>
          )}
          {currentOrder.orderTotal && Number(currentOrder.orderTotal) > 0 && (
            <div className="flex justify-between border-t mt-2 pt-3 text-base sm:text-lg font-bold">
              <div className="flex items-center gap-2">
                <LuSquareSigma className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span>Total</span>
              </div>
              <span>${currentOrder.orderTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mt-10 px-4 sm:px-6 md:px-12">
        <h2 className="text-gray-600 mb-4 text-lg font-bold flex items-center gap-2">
          <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          Order Details by Vendor
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {orderData.map((order) => (
            <VendorOrderGroup key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
}
