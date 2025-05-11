"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingCart,
  ChefHat,
  Flame,
  Package,
  Receipt,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "../loading";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pendingActionRef = useRef(null);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.error("Invalid cart data in localStorage");
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle pending actions after cart updates
  useEffect(() => {
    if (pendingActionRef.current) {
      const { type, item, message } = pendingActionRef.current;

      if (type === "remove") {
        if (cart.length === 0) {
          toast.info("Your cart is now empty");
        } else {
          toast.success(message);
        }
      } else if (type === "clear") {
        toast.success(message);
      }

      pendingActionRef.current = null;
    }
  }, [cart]);

  // Calculate subtotal and total items whenever cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => {
      const toppingsTotal = item.toppings.reduce(
        (tSum, topping) => tSum + topping.price,
        0
      );
      const extrasTotal = item.extras.reduce(
        (eSum, extra) => eSum + extra.price,
        0
      );
      return (
        sum + (item.basePrice + toppingsTotal + extrasTotal) * item.quantity
      );
    }, 0);
    const newTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    setSubtotal(newSubtotal);
    setTotalItems(newTotalItems);
  }, [cart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        toast.error("Failed to save cart changes");
      }
    }
  }, [cart, isLoading]);

  const updateQty = (item, delta) => {
    try {
      setCart((prevCart) => {
        return prevCart.map((cartItem) => {
          if (
            cartItem.id === item.id &&
            cartItem.selectedSpiciness === item.selectedSpiciness &&
            JSON.stringify(cartItem.toppings) ===
              JSON.stringify(item.toppings) &&
            JSON.stringify(cartItem.extras) === JSON.stringify(item.extras)
          ) {
            const newQuantity = Math.max(1, cartItem.quantity + delta);
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = (item) => {
    try {
      pendingActionRef.current = {
        type: "remove",
        item,
        message: `${item.name} removed from cart`,
      };

      setCart((prevCart) => {
        return prevCart.filter((cartItem) => {
          return !(
            cartItem.id === item.id &&
            cartItem.selectedSpiciness === item.selectedSpiciness &&
            JSON.stringify(cartItem.toppings) ===
              JSON.stringify(item.toppings) &&
            JSON.stringify(cartItem.extras) === JSON.stringify(item.extras)
          );
        });
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearAll = () => {
    try {
      if (cart.length > 0) {
        pendingActionRef.current = {
          type: "clear",
          message: "All items removed from cart",
        };
        setCart([]);
      } else {
        toast.info("Cart is already empty");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    try {
      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      toast.success("Proceeding to checkout...");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to proceed with checkout");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mx-3">
      <div className="w-full mx-auto py-10 px-2 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ShoppingCart className="text-rose-500" />
              Shopping Cart
            </h2>
            <div className="flex items-center gap-8">
              <Link
                href="/explore"
                className="text-base font-bold text-rose-500 hover:underline underline-offset-2 flex items-center gap-2"
              >
                Continue shopping <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.2fr_0.75fr_0.5fr] px-2 pb-2 border-b border-gray-200 mb-2">
            <div className="text-base font-bold text-rose-500">Product</div>
            <div className="text-base font-bold text-rose-500 text-center">
              AddOns
            </div>
            <div className="text-base font-bold text-rose-500 text-center">
              Quantity
            </div>
            <div className="text-base font-bold text-rose-500 text-center">
              Total Price
            </div>
            <div className="text-base font-bold text-rose-500 text-center">
              {cart.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-base font-bold text-red-500 hover:text-red-700 text-right"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 text-rose-500 font-semibold hover:underline"
                >
                  Start shopping <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              cart.map((item, index) => {
                // Create a unique key for React
                const uniqueKey = `${item.id}-${
                  item.selectedSpiciness || "none"
                }-${JSON.stringify(item.toppings)}-${JSON.stringify(
                  item.extras
                )}-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.2fr_0.75fr_0.5fr] items-center py-4 px-0 md:px-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.name}
                          fill
                          className="object-cover aspect-video"
                        />
                      </div>
                      <div>
                        <div className="font-black text-lg text-black leading-tight">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400 font-medium flex items-center gap-1">
                          <ChefHat size={14} />
                          {item.chef.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {item.selectedSpiciness && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium flex items-center gap-1">
                            <Flame size={14} />
                          </span>
                          <span>{item.selectedSpiciness}</span>
                        </div>
                      )}

                      {item.toppings.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium flex items-center gap-1">
                            <Package size={14} />
                          </span>
                          <span>
                            {item.toppings
                              .map((t) => `${t.name} (${t.option})`)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {item.extras.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium flex items-center gap-1">
                            <Receipt size={14} />
                          </span>
                          <span>
                            {item.extras.map((e) => `${e.name}`).join(", ") ||
                              "None"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-rose-500 text-white rounded-full flex items-center gap-2 p-2 w-fit mx-auto">
                      <button
                        onClick={() => updateQty(item, -1)}
                        className="hover:bg-rose-400 rounded-full p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-7 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item, 1)}
                        className="hover:bg-rose-400 rounded-full p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex justify-start font-black text-lg text-black pl-1">
                      $
                      {(
                        (item.basePrice +
                          item.toppings.reduce((sum, t) => sum + t.price, 0) +
                          item.extras.reduce((sum, e) => sum + e.price, 0)) *
                        item.quantity
                      ).toFixed(2)}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeItem(item)}
                        className="text-gray-400 hover:text-red-500 flex items-center justify-center"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit flex flex-col min-w-[320px]">
          <h3 className="font-black text-2xl mb-6 flex items-center gap-2">
            Order Summary
          </h3>
          <div className="bg-[#F8F8F8] rounded-xl p-6 mb-6">
            <div className="flex justify-between text-base font-bold mb-2">
              <span>Total Meal Items:</span> <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total Price:</span>
              <span className="text-red-500">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className={`w-full py-3 bg-rose-600 text-white shadow-rose-300 hover:bg-rose-700 rounded-full shadow-md transition-all font-semibold flex items-center justify-center gap-2 
              ${cart.length === 0 && "opacity-50 cursor-not-allowed"}
            `}
            disabled={cart.length === 0}
          >
            <CreditCard size={20} />
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
