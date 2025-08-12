"use client";
import {
  BadgePercent,
  ShoppingCart,
  Receipt,
  Truck,
  Lock,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";
import { getCookie } from "cookies-next";
import Spinner from "../components/Spinner";
import Loading from "../loading";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  address: "",
  note: "",
  user: "",
  deliveryType: "delivery",
  deliveryDate: new Date(),
  deliveryTime: (() => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 30 * 60000);
    // Round up to next 5-minute interval
    const minutes = minTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    minTime.setMinutes(roundedMinutes, 0, 0);
    return format(minTime, "HH:mm");
  })(),
};

const getMinTimeForDate = (date) => {
  const now = new Date();
  const selectedDate = new Date(date);
  const isToday = format(now, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  if (!isToday) return undefined;
  
  // Add 30 minutes to current time and round up to next 5-minute interval
  const minTime = new Date(now.getTime() + 30 * 60000);
  const minutes = minTime.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  minTime.setMinutes(roundedMinutes, 0, 0);
  
  return format(minTime, "HH:mm");
};

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [tax, setTax] = useState(0);
  const [deliveryFeeLoading, setDeliveryFeeLoading] = useState(false);
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [taxLoading, setTaxLoading] = useState(true);

  const fetchTaxPercentage = useCallback(async () => {
    try {
      setTaxLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/admin`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tax percentage');
      }
      const data = await response.json();
      if (data.data && data.data.taxPercentage !== undefined) {
        setTaxPercentage(data.data.taxPercentage);
      } else {
        setTaxPercentage(10);
      }
    } catch (error) {
      console.error('Error fetching tax percentage:', error);
      toast.error('Failed to fetch tax percentage. Using default value.');
      setTaxPercentage(10);
    } finally {
      setTaxLoading(false);
    }
  }, []);

  const validateCart = useCallback(() => {
    const storedCartItems = localStorage.getItem("cart");
    if (!storedCartItems || JSON.parse(storedCartItems).length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      router.push("/");
      return false;
    }
    setCartItems(JSON.parse(storedCartItems));
    return true;
  }, [router]);

  const getAllVendorsDeliveryFees = useCallback(async (cartItems) => {
    if (!cartItems.length) return;
    setDeliveryFeeLoading(true);
    try {
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
          } catch (error) {
            console.error(`Error fetching vendor ${vendorId}:`, error);
            return {
              vendorId,
              storeName: "Unknown Vendor",
              vendorDeliveryFee: 0,
            };
          }
        })
      );
      setDeliveryFees(vendorDeliveryFees);
    } catch (error) {
      console.error("Error fetching delivery fees:", error);
      toast.error("Failed to load delivery fees. Please try again.");
    } finally {
      setDeliveryFeeLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCookie("user");
      const jwt = getCookie("jwt");
      if (!user || !jwt) {
        toast.error("Please sign in to complete your order");
        router.push("/login");
        return;
      }
      const storedZipCode = typeof window !== "undefined" ? (localStorage.getItem("zipcode") || "") : "";
      setFormData((prev) => ({ ...prev, user, zip: storedZipCode }));
      validateCart();
    };
    checkAuth();
    fetchTaxPercentage();
  }, [router, validateCart, fetchTaxPercentage]);

  useEffect(() => {
    if (cartItems.length > 0) {
      getAllVendorsDeliveryFees(cartItems);
    } else {
      setDeliveryFees([]);
    }
  }, [cartItems, getAllVendorsDeliveryFees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "phone" ? value.replace(/[^0-9 +]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const calculateSubtotal = useCallback(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((sum, vendor) => {
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
    }, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    const calculatedSubtotal = calculateSubtotal();
    return Number(calculatedSubtotal.toFixed(2));
  }, [calculateSubtotal]);

  const calculatedTax = useMemo(() => {
    return Number(((subtotal * taxPercentage) / 100).toFixed(2));
  }, [subtotal, taxPercentage]);

  const totalDeliveryFee = useMemo(() => {
    return deliveryFees.reduce((a, b) => a + (b.vendorDeliveryFee || 0), 0);
  }, [deliveryFees]);

  const total = useMemo(() => {
    return Number((subtotal + calculatedTax + totalDeliveryFee).toFixed(2));
  }, [subtotal, calculatedTax, totalDeliveryFee]);

  useEffect(() => {
    setTax(calculatedTax);
  }, [calculatedTax]);

  const addOrder = useCallback(async (orderData) => {
    try {
      const user = getCookie("user");
      if (!user) {
        throw new Error("Authentication required");
      }
      console.log(JSON.stringify({ ...orderData, user }));
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
  }, []);

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
      const orderSubtotal = calculateSubtotal();
      const orderTax = Number(
        ((orderSubtotal * taxPercentage) / 100).toFixed(2)
      );
      const vendorProportions = cartItems.map((vendor) => {
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
          proportion: orderSubtotal > 0 ? vendorSubtotal / orderSubtotal : 0,
        };
      });
      const orderPromises = cartItems.map((vendor, index) => {
        const { subtotal: vendorSubtotal } = vendorProportions[index];
        const vendorTax = Number(
          ((vendorSubtotal * taxPercentage) / 100).toFixed(2)
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
          deliveryType: formData.deliveryType,
          deliveryDate: formData.deliveryDate
            ? format(formData.deliveryDate, "yyyy-MM-dd")
            : "",
          deliveryTime: formData.deliveryTime?.match(/^\d{2}:\d{2}$/)
            ? `${formData.deliveryTime}:00.000`
            : formData.deliveryTime || "",
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

  if (deliveryFeeLoading || taxLoading) return <Loading />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} className="mx-3">
        <div className="w-full mx-auto pb-10 px-2 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] col-span-2 mb-6 md:mb-0">
            <h2 className="text-2xl font-black tracking-tight mb-8 text-rose-600 flex items-center gap-2">
              <ShoppingCart className="inline" />
              Checkout
            </h2>
            <div className="mb-8">
              <h3 className="font-black text-lg mb-6 text-black flex items-center gap-2">
                <Truck className="inline" /> Delivery Options
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    formData.deliveryType === "delivery" 
                      ? "border-rose-500 bg-rose-50 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      id="delivery"
                      value="delivery"
                      checked={formData.deliveryType === "delivery"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="delivery"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.deliveryType === "delivery" 
                          ? "border-rose-500 bg-rose-500" 
                          : "border-gray-300"
                      }`}>
                        {formData.deliveryType === "delivery" && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6 text-rose-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Delivery Address</div>
                          <div className="text-sm text-gray-600">We&apos;ll deliver to your address</div>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    formData.deliveryType === "pickup" 
                      ? "border-rose-500 bg-rose-50 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      id="pickup"
                      value="pickup"
                      checked={formData.deliveryType === "pickup"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="pickup"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.deliveryType === "pickup" 
                          ? "border-rose-500 bg-rose-500" 
                          : "border-gray-300"
                      }`}>
                        {formData.deliveryType === "pickup" && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <FaShoppingBag className="w-6 h-6 text-rose-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Pickup</div>
                          <div className="text-sm text-gray-600">Collect from the restaurant</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="font-black text-lg mb-6 text-black flex items-center gap-2">
                <User className="inline" /> Delivery Information
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
                        placeholder="Zip Code"
                        readOnly
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
              </div>
              <div className="mb-8">
                <h3 className="font-black text-lg mt-8 mb-4 text-black flex items-center gap-2">
                  <Calendar className="inline" /> Delivery Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <label className="block font-semibold text-sm text-slate-500 pl-3">
                      Delivery Date
                    </label>
                    <div className="w-full">
                      <DatePicker
                        value={dayjs(formData.deliveryDate)}
                        onChange={(date) => {
                          if (!date) return;
                          const selectedDate = date.toDate();
                          const now = new Date();
                          
                          // Check if selected date is in the past
                          if (selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                            toast.error("Cannot select a past date");
                            return;
                          }
                          
                          const minTime = getMinTimeForDate(selectedDate);
                          setFormData((prev) => ({
                            ...prev,
                            deliveryDate: selectedDate,
                            deliveryTime: minTime || prev.deliveryTime,
                          }));
                        }}
                        minDate={dayjs()}
                        className="w-full rounded-xl"
                        sx={{
                          '& .MuiPickersSectionList-root': {
                            paddingTop: '21px',
                          },
                          '& .MuiIconButton-root': {
                            marginBottom: '-5px',
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <label className="block font-semibold text-sm text-slate-500 pl-3">
                      Delivery Time
                    </label>
                    <div className="w-full">
                      <TimePicker
                        value={dayjs(`2000-01-01 ${formData.deliveryTime}`)}
                        onChange={(time) => {
                          if (!time) return;
                          const selectedTime = time.format("HH:mm");
                          const now = new Date();
                          const selectedDate = formData.deliveryDate;
                          
                          // Check if selected date is today and time is in the past
                          if (format(now, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
                            const currentTime = format(now, "HH:mm");
                            if (selectedTime <= currentTime) {
                              toast.error("Cannot select a time in the past");
                              return;
                            }
                            
                            // Check if time is at least 30 minutes from now
                            const minTime = getMinTimeForDate(selectedDate);
                            if (minTime && selectedTime < minTime) {
                              toast.error("Please select a time at least 30 minutes from now");
                              return;
                            }
                          }
                          
                          // Validate 5-minute intervals
                          const minutes = parseInt(selectedTime.split(':')[1]);
                          if (minutes % 5 !== 0) {
                            toast.error("Please select a time in 5-minute intervals (e.g., 5:00, 5:05, 5:10)");
                            return;
                          }
                          
                          setFormData((prev) => ({
                            ...prev,
                            deliveryTime: selectedTime,
                          }));
                        }}
                        minTime={getMinTimeForDate(formData.deliveryDate) ? dayjs(`2000-01-01 ${getMinTimeForDate(formData.deliveryDate)}`) : undefined}
                        className="w-full rounded-xl"
                        views={['hours', 'minutes']}
                        minutesStep={5}
                        sx={{
                          '& .MuiPickersSectionList-root': {
                            paddingTop: '21px',
                          },
                          '& .MuiIconButton-root': {
                            marginBottom: '-5px',
                          }
                        }}
                      />
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
                <span className="text-rose-600">${total.toFixed(2)}</span>
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
    </LocalizationProvider>
  );
};

export default Page;
