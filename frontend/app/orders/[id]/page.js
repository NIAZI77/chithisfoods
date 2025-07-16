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
  Star,
  MessageSquare,
  X,
  Clock,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { FaStore, FaStar, FaPaypal } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "./components/dialog";
import OrderHeader from "./components/OrderHeader";
import OrderDetails from "./components/OrderDetails";
import OrderSummary from "./components/OrderSummary";
import VendorOrderGroup from "./components/VendorOrderGroup";
import OrderStatusBadge from "./components/OrderStatusBadge";

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

  const handleStatusUpdate = () => {
    fetchOrderDetails(orderId);
  };

  if (isLoading) return <Loading />;

  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3 capitalize text-rose-600">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to view this order. This order belongs to another user account.
          </p>
          <div className="space-y-3">
            <Link
              href="/profile/order-history"
              className="inline-block px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
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
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => fetchOrderDetails(orderId)}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Try Again
            </button>
            <div>
              <Link
                href="/profile/order-history"
                className="text-rose-600 hover:text-rose-700 underline"
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
          <h1 className="text-2xl font-bold mb-3 capitalize text-rose-600">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find an order with the ID <strong>{orderId}</strong>. Please check the order number and try again.
          </p>
          <div className="space-y-3">
            <Link
              href="/profile/order-history"
              className="inline-block px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
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

  const currentOrder = orderData[0];

  return (
    <>
      <OrderHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:px-12 px-4">
        <OrderDetails order={currentOrder} />
        <OrderSummary orderData={orderData} currentOrder={currentOrder} />
      </div>

      <div className="mt-8 sm:mt-10 px-4 sm:px-6 md:px-12">
        <h2 className="text-gray-600 mb-4 text-lg font-bold flex items-center gap-2">
          <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          Order Details by Vendor
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {orderData.map((order) => (
            <VendorOrderGroup
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
