"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingCart,
  ChefHat,
  Flame,
  Salad,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "../loading";
import { FaCreditCard } from "react-icons/fa";
import { PiBowlFood } from "react-icons/pi";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch {
        setCart([]);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const newSubtotal = cart.reduce((sum, vendorGroup) => {
      const vendorTotal = vendorGroup.dishes.reduce((dishSum, dish) => {
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

    const newTotalItems = cart.reduce(
      (sum, vendorGroup) =>
        sum +
        vendorGroup.dishes.reduce(
          (dishSum, dish) => dishSum + dish.quantity,
          0
        ),
      0
    );

    setSubtotal(newSubtotal);
    setTotalItems(newTotalItems);
  }, [cart]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const updateQty = (vendorId, dish, delta) => {
    setCart((prevCart) =>
      prevCart.map((vendorGroup) => {
        if (vendorGroup.vendorId === vendorId) {
          return {
            ...vendorGroup,
            dishes: vendorGroup.dishes.map((cartDish) => {
              if (
                cartDish.id === dish.id &&
                cartDish.selectedSpiciness === dish.selectedSpiciness &&
                JSON.stringify(cartDish.toppings) ===
                  JSON.stringify(dish.toppings) &&
                JSON.stringify(cartDish.extras) === JSON.stringify(dish.extras)
              ) {
                const newQuantity = Math.max(1, cartDish.quantity + delta);
                const toppingsTotal = cartDish.toppings.reduce(
                  (sum, topping) => sum + (topping.price || 0),
                  0
                );
                const extrasTotal = cartDish.extras.reduce(
                  (sum, extra) => sum + (extra.price || 0),
                  0
                );
                const total =
                  (Number(cartDish.basePrice) + toppingsTotal + extrasTotal) *
                  newQuantity;
                return {
                  ...cartDish,
                  quantity: newQuantity,
                  total: total.toFixed(2),
                };
              }
              return cartDish;
            }),
          };
        }
        return vendorGroup;
      })
    );
  };

  const removeItem = (vendorId, dish) => {
    setCart((prevCart) =>
      prevCart
        .map((vendorGroup) => {
          if (vendorGroup.vendorId === vendorId) {
            const updatedDishes = vendorGroup.dishes.filter(
              (cartDish) =>
                !(
                  cartDish.id === dish.id &&
                  cartDish.selectedSpiciness === dish.selectedSpiciness &&
                  JSON.stringify(cartDish.toppings) ===
                    JSON.stringify(dish.toppings) &&
                  JSON.stringify(cartDish.extras) ===
                    JSON.stringify(dish.extras)
                )
            );
            return updatedDishes.length === 0
              ? null
              : { ...vendorGroup, dishes: updatedDishes };
          }
          return vendorGroup;
        })
        .filter(Boolean)
    );
    toast.success(`${dish.name} has been removed from your cart`);
  };

  const clearAll = () => {
    if (cart.length > 0) {
      setCart([]);
      toast.success("All items have been removed from your cart");
    } else {
      toast.info("Your cart is already empty");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Please add items to your cart before checkout");
      return;
    }
    toast.success("Redirecting to checkout...");
    router.push("/checkout");
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
            <Link
              href="/explore"
              className="text-base font-bold text-rose-500 hover:underline underline-offset-2 flex items-center gap-2"
            >
              Continue shopping <ArrowRight />
            </Link>
          </div>

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
            <div className="space-y-8">
              {cart.map((vendorGroup) => (
                <div
                  key={vendorGroup.vendorId}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <Image
                      src={vendorGroup.vendorAvatar}
                      alt={vendorGroup.vendorName}
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h3 className="font-semibold flex items-center gap-1">
                          <ChefHat className="w-5 h-5" />
                          {vendorGroup.vendorName}
                        </h3>
                        {vendorGroup.vendorUsername && (
                          <Link
                            href={`/vendors/@${vendorGroup.vendorUsername}`}
                            className="text-sm text-gray-500 hover:text-rose-500 hover:underline"
                          >
                            @{vendorGroup.vendorUsername}
                          </Link>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {vendorGroup.dishes.length}{" "}
                          {vendorGroup.dishes.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-[2fr_1.6fr_1.2fr_0.75fr_0.5fr] px-2 pb-2 border-b border-gray-200 mb-2">
                    <div className="text-base font-bold text-rose-500">
                      Product
                    </div>
                    <div className="text-sm font-bold text-rose-500 text-center">
                      AddOns
                    </div>
                    <div className="text-sm font-bold text-rose-500 text-center">
                      Quantity
                    </div>
                    <div className="text-sm font-bold text-rose-500 text-center">
                      Total Price
                    </div>
                    <div className="text-sm font-bold text-rose-500 text-center">
                      <button
                        onClick={() => {
                          setCart((prevCart) =>
                            prevCart.filter(
                              (group) => group.vendorId !== vendorGroup.vendorId
                            )
                          );
                          toast.success(
                            `All items from ${vendorGroup.vendorName} have been removed`
                          );
                        }}
                        className="text-base font-bold text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {vendorGroup.dishes.map((dish, index) => {
                      const uniqueKey = `${dish.id}-${
                        dish.selectedSpiciness || "none"
                      }-${JSON.stringify(dish.toppings)}-${JSON.stringify(
                        dish.extras
                      )}-${index}`;

                      return (
                        <div
                          key={uniqueKey}
                          className="grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.2fr_0.75fr_0.5fr] items-center py-4 px-0 md:px-2"
                        >
                          <div className="flex items-center gap-4">
                            <Image
                              src={dish.image.url}
                              alt={dish.name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{dish.name}</h3>
                              {dish.selectedSpiciness && (
                                <div className="flex items-center gap-1 text-sm text-orange-400 font-bold">
                                  <Flame className="w-4 h-4" />
                                  {dish.selectedSpiciness}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {dish.toppings?.length > 0 && (
                              <div>
                                <div className="flex flex-wrap gap-1">
                                  {dish.toppings.map((topping, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-sm"
                                    >
                                      <PiBowlFood size={14} /> {topping.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {dish.extras?.length > 0 && (
                              <div>
                                <div className="flex flex-wrap gap-1">
                                  {dish.extras.map((extra, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-sm"
                                    >
                                      <Salad size={14} /> {extra.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {!dish.toppings.length && !dish.extras.length && (
                              <div className="text-gray-400 text-xs text-center">
                                No addons selected
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                updateQty(vendorGroup.vendorId, dish, -1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {dish.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(vendorGroup.vendorId, dish, 1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-center font-semibold">
                            ${dish.total}
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                removeItem(vendorGroup.vendorId, dish)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Items ({totalItems})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>SubTotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              <FaCreditCard />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
