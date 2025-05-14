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
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  address: "",
  promo: "",
  note: "",
  deliveryType: "delivery",
};

const TAX_PERCENTAGE = 10;
const DELIVERY_FEE = 0;

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [tax, setTax] = useState(0);

  const validateCart = useCallback(() => {
    const storedCartItems = localStorage.getItem("cart");
    if (!storedCartItems || JSON.parse(storedCartItems).length === 0) {
      toast.error("Cart is empty");
      router.push("/");
      return false;
    }

    setCartItems(JSON.parse(storedCartItems));
    return true;
  }, [router]);

  useEffect(() => {
    validateCart();
  }, [validateCart]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((sum, vendor) => {
      const vendorTotal = vendor.dishes.reduce((dishSum, dish) => {
        const toppingsTotal = dish.toppings.reduce(
          (tSum, topping) => tSum + (topping.price || 0),
          0
        );
        const extrasTotal = dish.extras.reduce(
          (eSum, extra) => eSum + (extra.price || 0),
          0
        );
        return (
          dishSum +
          (Number(dish.basePrice) + toppingsTotal + extrasTotal) * dish.quantity
        );
      }, 0);
      return sum + vendorTotal;
    }, 0);
  }, [cartItems]);

  const subtotal = calculateSubtotal();
  const calculatedTax = (subtotal * TAX_PERCENTAGE) / 100;
  const total = subtotal + calculatedTax + DELIVERY_FEE;

  useEffect(() => {
    setTax(calculatedTax);
  }, [calculatedTax]);

  const addOrder = async (orderData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: orderData }),
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
      const orderPromises = cartItems.map((vendor) => {
        const subtotal = vendor.dishes
          .reduce((sum, dish) => {
            return sum + (parseFloat(dish.total) || 0);
          }, 0)
          .toFixed(2);

        const orderData = {
          customerName: formData.name,
          customerOrderId,
          phone: formData.phone,
          address:
            formData.deliveryType === "delivery"
              ? `${formData.address}, ${formData.zip}`
              : "Pickup",
          note: formData.note,
          tax,
          totalAmount: total,
          paymentStatus: "paid",
          deliveryType: formData.deliveryType,
          promoCode: formData.promo,
          orderStatus: "pending",
          ...vendor,
          subtotal,
        };

        return addOrder(orderData);
      });

      await Promise.all(orderPromises);

      toast.success("Order placed!");
      localStorage.removeItem("cart");
      router.push(`/thank-you/${customerOrderId}`);
    } catch (error) {
      console.error("Error placing orders:", error);
      toast.error("Order failed. Try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-3">
      <div className="w-full mx-auto py-10 px-2 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex justify-between text-base font-bold mb-2">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Delivery
              </span>
              <span>${DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black mt-2">
              <span className="flex items-center gap-2">
                <LuSquareSigma className="w-5 h-5" />
                Total
              </span>
              <span className="text-rose-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mb-8">
            <label className="font-semibold text-sm text-slate-500 pl-3 flex items-center gap-2">
              <BadgePercent className="w-4 h-4" />
              Promo Code
            </label>
            <div className="relative flex items-center justify-center">
              <input
                type="text"
                name="promo"
                value={formData.promo}
                onChange={handleChange}
                placeholder="Promo Code"
                className="bg-gray-100 pl-10 pr-4 py-2 rounded-l-full border-none outline-none w-full sm:w-64"
              />
              <BadgePercent className="w-5 h-5 text-gray-500 absolute left-3" />
              <button
                type="submit"
                className="bg-red-600 text-white px-5 py-2 rounded-r-full border-none outline-none hover:bg-red-700 transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            {submitting ? "Processing Order..." : "PLACE ORDER"}
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
