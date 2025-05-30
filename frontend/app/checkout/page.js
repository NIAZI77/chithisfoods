"use client";
import {
  BadgePercent,
  ShoppingCart,
  Receipt,
  Truck,
  Lock,
  User,
} from "lucide-react";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";
import { getCookie } from "cookies-next";
import Spinner from "../components/Spinner";
import Loading from "../loading";

const TAX_PERCENTAGE = 10;
const initialFormData = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  address: "",
  note: "",
  user: "",
  deliveryType: "delivery",
};

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [tax, setTax] = useState(0);
  const [deliveryFeeLoading, setDeliveryFeeLoading] = useState(false);

  const validateCart = () => {
    const storedCartItems = localStorage.getItem("cart");
    if (!storedCartItems || JSON.parse(storedCartItems).length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      router.push("/");
      return false;
    }
    setCartItems(JSON.parse(storedCartItems));
    return true;
  };
  const getAllVendorsDeliveryFees = async (cartItems) => {
    setDeliveryFeeLoading(true);
    const vendorIds = [
      ...new Set(cartItems.map((vendorGroup) => vendorGroup.vendorId)),
    ];
    const vendorDeliveryFees = await Promise.all(
      vendorIds.map(async (vendorId) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}?fields[0]=vendorDeliveryFee&fields[1]=storeName`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch vendor info");
          const data = await res.json();
          return {
            vendorId,
            storeName: data.data?.storeName || "Unknown Vendor",
            vendorDeliveryFee: Number(data.data?.vendorDeliveryFee) || 0,
          };
        } catch {
          return {
            vendorId,
            storeName: "Unknown Vendor",
            vendorDeliveryFee: 0,
          };
        }
      })
    );
    setDeliveryFees(vendorDeliveryFees);
    setDeliveryFeeLoading(false);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCookie("user");
      const jwt = getCookie("jwt");
      if (!user || !jwt) {
        toast.error("Please sign in to complete your order");
        router.push("/login");
        return;
      }
      setFormData((prev) => ({ ...prev, user }));
      validateCart();
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (cartItems.length > 0) {
      getAllVendorsDeliveryFees(cartItems);
    } else {
      setDeliveryFees([]);
    }
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateSubtotal = () => {
    return Number(
      cartItems
        .reduce((sum, vendor) => {
          const vendorTotal = vendor.dishes.reduce((dishSum, dish) => {
            const toppingsTotal = dish.toppings.reduce(
              (tSum, topping) => tSum + (Number(topping.price) || 0),
              0
            );
            const extrasTotal = dish.extras.reduce(
              (eSum, extra) => eSum + (Number(extra.price) || 0),
              0
            );
            return (
              dishSum +
              (Number(dish.basePrice) + toppingsTotal + extrasTotal) *
                Number(dish.quantity)
            );
          }, 0);
          return sum + vendorTotal;
        }, 0)
        .toFixed(2)
    );
  };

  const subtotal = Number(calculateSubtotal().toFixed(2));
  const calculatedTax = Number(((subtotal * TAX_PERCENTAGE) / 100).toFixed(2));
  const totalDeliveryFee = deliveryFees.reduce(
    (a, b) => a + (b.vendorDeliveryFee || 0),
    0
  );
  const total = Number(
    (subtotal + calculatedTax + totalDeliveryFee).toFixed(2)
  );
  useEffect(() => {
    setTax(calculatedTax);
  }, [calculatedTax]);

  const addOrder = async (orderData) => {
    try {
      const user = getCookie("user");
      if (!user) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: { ...orderData, user } }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to place order");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error.message || "Failed to place order. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const customerOrderId = new Date().getTime();

    try {
      const user = getCookie("user");
      if (!user) {
        toast.error("Please sign in to complete your order");
        router.push("/login");
        return;
      }

      const orderSubtotal = cartItems.reduce((sum, vendor) => {
        const vendorSubtotal = vendor.dishes.reduce((dishSum, dish) => {
          const toppingsTotal = dish.toppings.reduce(
            (tSum, topping) => tSum + (Number(topping.price) || 0),
            0
          );
          const extrasTotal = dish.extras.reduce(
            (eSum, extra) => eSum + (Number(extra.price) || 0),
            0
          );
          return (
            dishSum +
            (Number(dish.basePrice) + toppingsTotal + extrasTotal) *
              Number(dish.quantity)
          );
        }, 0);
        return sum + vendorSubtotal;
      }, 0);

      const orderTax = Number(
        ((orderSubtotal * TAX_PERCENTAGE) / 100).toFixed(2)
      );
      const orderTotal = Number(
        (orderSubtotal + orderTax + totalDeliveryFee).toFixed(2)
      );

      const vendorProportions = cartItems.map((vendor, index) => {
        const vendorSubtotal = vendor.dishes.reduce((sum, dish) => {
          const toppingsTotal = dish.toppings.reduce(
            (tSum, topping) => tSum + (Number(topping.price) || 0),
            0
          );
          const extrasTotal = dish.extras.reduce(
            (eSum, extra) => eSum + (Number(extra.price) || 0),
            0
          );
          return (
            sum +
            (Number(dish.basePrice) + toppingsTotal + extrasTotal) *
              Number(dish.quantity)
          );
        }, 0);
        return {
          subtotal: vendorSubtotal,
          proportion: vendorSubtotal / orderSubtotal,
        };
      });

      const orderPromises = cartItems.map((vendor, index) => {
        const { subtotal: vendorSubtotal } = vendorProportions[index];
        const vendorTax = Number(
          ((vendorSubtotal * TAX_PERCENTAGE) / 100).toFixed(2)
        );
        const vendorFeeObj = deliveryFees.find(
          (fee) => fee.vendorId === vendor.vendorId
        );
        const vendorDeliveryFee = vendorFeeObj
          ? vendorFeeObj.vendorDeliveryFee
          : 0;
        const vendorTotal = Number(
          (vendorSubtotal + vendorTax + vendorDeliveryFee).toFixed(2)
        );

        const orderData = {
          customerName: formData.name,
          customerOrderId,
          phone: formData.phone,
          address:
            formData.deliveryType === "delivery"
              ? `${formData.address}, ${formData.zip}`
              : "Pickup",
          note: formData.note,
          tax: vendorTax,
          totalTax: tax,
          subtotal: Number(vendorSubtotal.toFixed(2)),
          totalAmount: vendorTotal,
          paymentStatus: "paid",
          deliveryType: formData.deliveryType,
          orderTotal: total,
          deliveryFee: totalDeliveryFee,
          vendorDeliveryFee: vendorDeliveryFee,
          orderStatus: "pending",
          ...vendor,
        };

        return addOrder(orderData);
      });

      await Promise.all(orderPromises);
      toast.success("Your order has been placed successfully!");
      localStorage.removeItem("cart");
      router.push(`/thank-you/${customerOrderId}`);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.message || "Unable to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (deliveryFeeLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="mx-3">
      <div className="w-full mx-auto pb-10 px-2 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] col-span-2 mb-6 md:mb-0">
          <h2 className="text-2xl font-black tracking-tight mb-8 text-rose-600 flex items-center gap-2">
            <ShoppingCart className="inline" />
            Checkout
          </h2>
          <div className="mb-8">
            <h3 className="font-black text-lg mb-6 text-black flex items-center gap-2">
              <User className="inline" /> General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Phone Number
                </label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Email
                </label>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                />
              </div>
              {formData.deliveryType === "delivery" && (
                <>
                  <div>
                    <label className="block font-semibold text-sm text-slate-500 pl-3">
                      Zip Code
                    </label>
                    <input
                      required
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="Zip Code"
                      className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-sm text-slate-500 pl-3">
                      Address
                    </label>
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-4 py-2 my-1 border rounded-full outline-rose-400"
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Instructions"
                  className="w-full px-4 py-2 my-1 border rounded-lg outline-rose-400 h-24 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-sm text-slate-500 pl-3">
                  Delivery Type
                </label>
                <div className="py-2 px-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      id="delivery"
                      value="delivery"
                      checked={formData.deliveryType === "delivery"}
                      onChange={handleChange}
                      className="w-4 h-4 accent-rose-600"
                    />
                    <label
                      htmlFor="delivery"
                      className="font-semibold text-sm text-slate-500 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      Delivery
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      id="pickup"
                      value="pickup"
                      checked={formData.deliveryType === "pickup"}
                      onChange={handleChange}
                      className="w-4 h-4 accent-rose-600"
                    />
                    <label
                      htmlFor="pickup"
                      className="font-semibold text-sm text-slate-500 flex items-center gap-2"
                    >
                      <FaShoppingBag className="w-4 h-4" />
                      Pickup
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-8 shadow-sm border border-gray-200 h-fit flex flex-col min-w-[320px]">
          <h3 className="font-black text-2xl mb-6 flex items-center gap-2 text-rose-600">
            <Receipt className="w-6 h-6" />
            Order Summary
          </h3>
          <div className="rounded-xl p-6 mb-6">
            <div className="flex justify-between text-base font-bold mb-2">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Subtotal
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold mb-2">
              <span className="flex items-center gap-2">
                <HiOutlineReceiptTax />
                Tax
              </span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="mb-2">
              {deliveryFees.map((fee) => (
                <div
                  key={fee.vendorId}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {fee.storeName}
                  </span>
                  <span>${fee.vendorDeliveryFee.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base font-bold mb-2">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Delivery
              </span>
              <span>${totalDeliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black mt-2">
              <span className="flex items-center gap-2">
                <LuSquareSigma className="w-5 h-5" />
                Total
              </span>
              <span className="text-rose-600">
                ${(subtotal + tax + totalDeliveryFee).toFixed(2)}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
          >
            {!submitting ? <Lock className="w-5 h-5" /> : ""}
            {submitting ? <Spinner /> : "PLACE ORDER"}
          </button>
          <div className="text-xs text-center text-gray-500 mt-4">
            By placing your order you agree to the{" "}
            <a href="/privacy-policy" className="underline text-rose-600">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-and-conditions" className="underline text-rose-600">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
