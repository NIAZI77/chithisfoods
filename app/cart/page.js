"use client";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { RiArrowLeftSLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';
import Link from 'next/link';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      item_id: "9876",
      item_name: "Chicken Alfredo",
      price: 15.99,
      quantity: 2,
      image_url: "https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg",
      vendor_name: "Saba's Kitchen",
      vendor_image_url: "https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg",
      item_description: "Creamy Alfredo sauce with grilled chicken over pasta.",
      nutrition_info: {
        calories: 800,
        protein: "45g",
        carbs: "60g",
        fat: "30g",
      },
      availability: "available",
    },
  ]);

  const [shippingFee, setShippingFee] = useState(4.99);
  const [taxRate, setTaxRate] = useState(18);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQuantity = (item_id, quantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.item_id === item_id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeItem = (item_id) => {
    const updatedCartItems = cartItems.filter((item) => item.item_id !== item_id);
    setCartItems(updatedCartItems);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxAmount = (totalPrice * taxRate) / 100;
  
  const isShippingFree = cartItems.length === 0 || totalPrice > 100;
  const totalWithTax = totalPrice + taxAmount + (isShippingFree ? 0 : shippingFee);
  const discountedTotal = totalWithTax - (totalWithTax * (discount / 100));
  const finalTotal = discountedTotal;

  const handleApplyCoupon = () => {
    if (couponCode === "SAVE10") {
      setDiscount(10);
      setCouponApplied(true);
      toast.success("Coupon applied: 10% off");
    } else if (couponCode === "SAVE20") {
      setDiscount(20);
      setCouponApplied(true);
      toast.success("Coupon applied: 20% off");
    } else {
      setDiscount(0);
      setCouponApplied(false);
      toast.error("Invalid coupon code");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cartItems.length} Items</h2>
          </div>

          {cartItems.map((item) => (
            <div key={item.item_id} className="md:flex items-stretch py-8 md:py-10 lg:py-8 border-t border-gray-50">
              <div className="md:w-4/12 2xl:w-1/4 w-full">
                <Image height={100} width={100} src={item.image_url} alt={item.item_name} className="h-full object-center object-cover md:block hidden w-full" />
                <Image height={100} width={100} src={item.image_url} alt={item.item_name} className="md:hidden w-full h-full object-center object-cover" />
              </div>
              <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                <div className="flex items-center justify-between w-full">
                  <p className="text-base font-black leading-none text-gray-800">{item.item_name}</p>
                  <select
                    aria-label="Select quantity"
                    className="py-2 px-1 border border-gray-200 mr-6"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.item_id, parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                      <option key={qty} value={qty}>{qty < 10 ? `0${qty}` : qty}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between pt-5">
                  <p className="text-base font-black leading-none text-gray-800">${item.price}</p>
                  <p className="text-xs leading-3 text-red-500 pl-5 cursor-pointer flex items-center pr-8" onClick={() => removeItem(item.item_id)}>
                    <FaTrashAlt className="mr-1 scale-150" />
                  </p>
                </div>
                <div className="flex items-center pt-5">
                  <Image height={100} width={100} src={item.vendor_image_url} alt={item.vendor_name} className="w-8 h-8 rounded-full mr-2" />
                  <p className="text-sm text-gray-600">{item.vendor_name}</p>
                </div>
              </div>
            </div>
          ))}

          <Link href="/" className="flex font-semibold text-orange-600 text-sm mt-10">
            <RiArrowLeftSLine className="fill-current mr-2 text-orange-600 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10 bg-orange-100">
          <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Items {cartItems.length}</span>
            <span className="font-semibold text-sm">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Shipping</span>
            <span className="font-semibold text-sm">Standard shipping - ${isShippingFree ? "0.00" : shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Tax</span>
            <span className="font-semibold text-sm">Estimated Tax - ${taxAmount.toFixed(2)}</span>
          </div>

          {couponApplied && (
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">Discount</span>
              <span className="font-semibold text-lg text-green-400">-${(totalWithTax * (discount / 100)).toFixed(2)}</span>
            </div>
          )}

          {!couponApplied ? (
            <div className="py-10 flex items-center justify-between">
              <input
                type="text"
                id="promo"
                placeholder="Enter your promo code"
                className="p-2 text-sm w-3/4"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="bg-orange-500 hover:bg-orange-600 px-5 py-2 text-sm text-white uppercase w-1/4"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="py-4 text-sm text-green-500 font-semibold">
              Coupon applied: {couponCode}
            </div>
          )}

          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            <button className="bg-orange-500 font-semibold hover:bg-orange-600 py-3 text-sm text-white uppercase w-full">
              Checkout
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Cart;