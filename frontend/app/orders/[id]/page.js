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
