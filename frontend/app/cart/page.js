"use client";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { RiArrowLeftSLine } from "react-icons/ri";
import { GiHotSpices } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [taxRate, setTaxRate] = useState(8);

  const groupCartItemsByVendor = (cart) =>
    cart.reduce((acc, item) => {
      const vendor = acc.find((v) => v.vendor_name === item.vendor_name);
      if (vendor) vendor.products.push(item);
      else acc.push({ vendor_name: item.vendor_name, products: [item] });
      return acc;
    }, []);

  const updateCartItemQuantity = (item_id, selectedSpiciness, increment) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === item_id && item.selectedSpiciness === selectedSpiciness
        ? { ...item, quantity: Math.max(1, item.quantity + increment) }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const removeItem = (item_id, selectedSpiciness) => {
    const updatedCartItems = cartItems.filter(
      (item) =>
        item.id !== item_id || item.selectedSpiciness !== selectedSpiciness
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const calculateTotals = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
    const taxAmount = totalPrice * (taxRate / 100);
    return { totalPrice, taxAmount, finalTotal: totalPrice + taxAmount };
  };

  const { totalPrice, taxAmount, finalTotal } = calculateTotals();

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    setCartItems(JSON.parse(cart) || []);
    console.log(cart);
  }, []);

  useEffect(() => {
    localStorage.setItem("total", finalTotal.toFixed(2));
    localStorage.setItem("taxRate", taxRate);
  }, [cartItems, finalTotal, taxRate]);

  const groupedCart = groupCartItemsByVendor(cartItems);

  return (
    <div className="w-[95%] mx-auto my-2">
      <div className="sm:flex">
        <div className="w-full bg-white p-4">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cartItems.length} Items</h2>
          </div>
          <Link
            href="/menu"
            className="flex font-semibold text-rose-600 text-sm mt-10"
          >
            <RiArrowLeftSLine className="fill-current mr-2 text-rose-600 w-4" />{" "}
            Continue Shopping
          </Link>
          {groupedCart.map((vendor, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-md my-2">
              <h3 className="font-semibold text-xl mt-8">
                {vendor.vendor_name}
              </h3>
              {vendor.products.map((item, idx) => (
                <div
                  key={idx}
                  className="md:flex items-stretch py-4 border-t border-gray-50 my-2"
                >
                  <Link
                    href={`/product/${item.vendorID}?productId=${item.id}`}
                    className="md:w-4/12 2xl:w-1/4 w-full mb-5"
                  >
                    <Image
                      height={100}
                      width={100}
                      src={item.image.url}
                      alt={item.name}
                      className="h-full object-center object-cover md:block hidden w-full"
                    />
                    <Image
                      height={100}
                      width={100}
                      src={item.image.url}
                      alt={item.name}
                      className="md:hidden w-full h-full object-center object-cover"
                    />
                  </Link>
                  <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-base font-black leading-none text-gray-800">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-center font-semibold border-rose-100">
                          <span
                            onClick={() =>
                              updateCartItemQuantity(
                                item.id,
                                item.selectedSpiciness,
                                -1
                              )
                            }
                            className="cursor-pointer rounded-l font-bold bg-rose-100 py-1 px-3.5 duration-100 hover:bg-rose-500 hover:text-rose-50"
                          >
                            -
                          </span>
                          <span className="py-1 px-3">{item.quantity}</span>
                          <span
                            onClick={() =>
                              updateCartItemQuantity(
                                item.id,
                                item.selectedSpiciness,
                                1
                              )
                            }
                            className="cursor-pointer rounded-r font-bold bg-rose-100 py-1 px-3 duration-100 hover:bg-rose-500 hover:text-rose-50"
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end py-2">
                      <div className="inline-flex items-center justify-center text-slate-500 px-2 bg-gray-200 rounded-lg font-bold">
                        Servings{" "}
                        {item?.serving > 1
                          ? `1-${item?.serving}`
                          : item?.serving || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-black leading-none text-gray-600">
                        ${item.price * item.quantity}
                      </p>
                      <p className="text-base font-black leading-none text-gray-600 flex items-center justify-center">
                        <GiHotSpices className="inline text-rose-500" />{" "}
                        {item.selectedSpiciness}
                      </p>
                      <p
                        className="text-xs leading-3 text-red-500 pl-5 cursor-pointer flex items-center pr-8"
                        onClick={() =>
                          removeItem(item.id, item.selectedSpiciness)
                        }
                      >
                        <FaTrashAlt className="mr-1 scale-150" />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-semibold text-2xl border-b pb-8">
            Order Summary
          </h1>
          <div className="flex justify-between mt-2 mb-5">
            <span className="font-semibold text-sm uppercase">
              Items {cartItems.length}
            </span>
            <span className="font-semibold text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mt-2 mb-5">
            <span className="font-semibold text-sm uppercase">Tax</span>
            <span className="font-semibold text-sm">
              Estimated Tax - ${taxAmount.toFixed(2)}{" "}
              {taxAmount > 0 && <span>({taxRate}%)</span>}
            </span>
          </div>

          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {cartItems.length > 0 ? (
              <Link href="/checkout">
                <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold">
                  Checkout
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full bg-rose-400 text-white py-3 rounded-full cursor-not-allowed shadow-rose-300 shadow-md"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
