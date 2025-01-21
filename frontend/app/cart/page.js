"use client";
import { useEffect, useState } from "react";
import { FaConciergeBell, FaTrashAlt } from "react-icons/fa";
import { RiArrowLeftSLine } from "react-icons/ri";
import { GiHotSpices } from "react-icons/gi";
import Link from "next/link";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [taxRate, setTaxRate] = useState(18);

  const incrementQuantity = (item_id, quantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === item_id ? { ...item, quantity: quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const decrementQuantity = (item_id, quantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === item_id && quantity > 1
        ? { ...item, quantity: quantity - 1 }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const removeItem = (item_id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== item_id);
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );
  const taxAmount = (totalPrice * taxRate) / 100;
  const finalTotal = totalPrice + taxAmount;

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    setCartItems(JSON.parse(cart) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("total", finalTotal.toFixed(2));
  }, [cartItems, finalTotal]);

  return (
    <div className="container mx-auto my-10">
      <div className="sm:flex my-10">
        <div className="w-full sm:w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cartItems.length} Items</h2>
          </div>

          {cartItems.map((item, index) => (
            <div
              key={index}
              className="md:flex items-stretch py-8 md:py-10 lg:py-8 border-t border-gray-50"
            >
              <Link
                href={`/product/${item.vendorID}?productId=${item.id}`}
                className="md:w-4/12 2xl:w-1/4 w-full mb-5"
              >
                <img
                  height={100}
                  width={100}
                  src={item.image.url}
                  alt={item.name}
                  className="h-full object-center object-cover md:block hidden w-full"
                />
                <img
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
                    <div className="flex items-center justify-center font-semibold border-orange-100">
                      <span
                        onClick={() =>
                          decrementQuantity(item.id, item.quantity)
                        }
                        className="cursor-pointer rounded-l font-bold bg-orange-100 py-1 px-3.5 duration-100 hover:bg-orange-500 hover:text-orange-50 "
                      >
                        -
                      </span>
                      <span className="text-center px-2">{item.quantity}</span>
                      <span
                        onClick={() =>
                          incrementQuantity(item.id, item.quantity)
                        }
                        className="cursor-pointer rounded-r font-bold bg-orange-100 py-1 px-3 duration-100 hover:bg-orange-500 hover:text-orange-50"
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>
                <div className=" py-3 flex items-center justify-between">
                  <p className="text-base font-black leading-none text-gray-800">
                    <FaConciergeBell className="inline mr-1" /> Serving Size
                  </p>
                  <p className="mr-9">{item.serving * item.quantity}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-black leading-none text-gray-600">
                    ${item.price * item.quantity}
                  </p>
                  <p className="text-base font-black leading-none text-gray-600 flex items-center justify-center">
                    <GiHotSpices className="inline  text-orange-500" />{" "}
                    {item.selectedSpiciness}
                  </p>
                  <p
                    className="text-xs leading-3 text-red-500 pl-5 cursor-pointer flex items-center pr-8"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrashAlt className="mr-1 scale-150" />
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/"
            className="flex font-semibold text-orange-600 text-sm mt-10"
          >
            <RiArrowLeftSLine className="fill-current mr-2 text-orange-600 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-semibold text-2xl border-b pb-8">
            Order Summary
          </h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">
              Items {cartItems.length}
            </span>
            <span className="font-semibold text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Tax</span>
            <span className="font-semibold text-sm">
              Estimated Tax - ${taxAmount.toFixed(2)}
            </span>
          </div>

          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {cartItems.length > 0 && (
              <Link href={"/checkout"}>
                <button className="bg-orange-500 font-semibold hover:bg-orange-600 py-3 text-sm text-white uppercase w-full">
                  Checkout
                </button>
              </Link>
            )}
            {cartItems.length === 0 && (
              <button
                disabled={true}
                className="bg-orange-300 font-semibold hover:bg-orange-300 py-3 text-sm text-white uppercase w-full cursor-not-allowed"
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
