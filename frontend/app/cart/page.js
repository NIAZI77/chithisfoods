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
  const [isUpdatingVendorData, setIsUpdatingVendorData] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  // Function to fetch vendor data from API
  const fetchVendorData = async (vendorId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vendor data");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      return null;
    }
  };

  // Function to update cart with vendor data
  const updateCartWithVendorData = async (cartData) => {
    setIsUpdatingVendorData(true);
    try {
      const updatedCart = await Promise.all(
        cartData.map(async (vendorGroup) => {
          // If vendor data is missing or incomplete, fetch it from API
          if (!vendorGroup.vendorAvatar || !vendorGroup.vendorUsername || !vendorGroup.vendorName) {
            const vendorData = await fetchVendorData(vendorGroup.vendorId);
            if (vendorData) {
              return {
                ...vendorGroup,
                vendorName: vendorData.storeName || vendorData.fullName || "Unknown Vendor",
                vendorUsername: vendorData.username || vendorGroup.vendorUsername || "",
                vendorAvatar: vendorData.avatar?.url || vendorGroup.vendorAvatar || "/fallback.png",
              };
            } else {
              // If we can't fetch vendor data, use fallbacks
              return {
                ...vendorGroup,
                vendorName: vendorGroup.vendorName || "Unknown Vendor",
                vendorUsername: vendorGroup.vendorUsername || "",
                vendorAvatar: vendorGroup.vendorAvatar || "/fallback.png",
              };
            }
          }
          return vendorGroup;
        })
      );
      return updatedCart;
    } finally {
      setIsUpdatingVendorData(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const cartArray = Array.isArray(parsedCart) ? parsedCart : [];
          
          // Update cart with vendor data if needed
          const updatedCart = await updateCartWithVendorData(cartArray);
          setCart(updatedCart);
        } catch (error) {
          console.error("Error loading cart:", error);
          setCart([]);
        }
      }
      setIsLoading(false);
    };

    loadCart();
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
    router.push("/checkout");
  };

  if (isLoading || isUpdatingVendorData) return <Loading />;

  return (
    <div className="mx-3">
      <div className="w-full mx-auto py-6 md:py-10 px-2 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] col-span-1 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <ShoppingCart className="text-rose-500" />
              Shopping Cart
            </h2>
            <Link
              href="/explore"
              className="text-sm md:text-base font-bold text-rose-500 hover:underline underline-offset-2 flex items-center gap-2"
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
            <div className="space-y-6 md:space-y-8">
              {cart.map((vendorGroup) => (
                <div
                  key={vendorGroup.vendorId}
                  className="border rounded-lg p-3 md:p-4"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <img
                      src={vendorGroup.vendorAvatar || "/fallback.png"}
                      alt={vendorGroup.vendorName}
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 object-cover"
                      onError={(e) => {
                        e.target.src = "/fallback.png";
                      }}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h3 className="font-semibold text-sm md:text-base flex items-center gap-1">
                          <ChefHat className="w-4 h-4 md:w-5 md:h-5" />
                          {vendorGroup.vendorName}
                        </h3>
                        {vendorGroup.vendorUsername && vendorGroup.vendorUsername.trim() !== "" && (
                          <Link
                            href={`/vendors/@${vendorGroup.vendorUsername}`}
                            className="text-xs md:text-sm text-gray-500 hover:text-rose-500 hover:underline"
                          >
                            @{vendorGroup.vendorUsername}
                          </Link>
                        )}
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
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
                          className="grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.2fr_0.75fr_0.5fr] items-start md:items-center py-4 px-0 md:px-2 gap-3 md:gap-0"
                        >
                          <div className="flex items-center gap-3 md:gap-4 ">
                            <img
                              src={dish.image.url}
                              alt={dish.name}
                              className="rounded-lg object-cover w-auto h-12 aspect-video"
                            />
                            <div>
                              <h3 className="font-semibold capitalize truncate text-sm">{
                              dish.name.length > 12
                                ? dish.name.slice(0, 12) + "..."
                                : dish.name
                                }</h3>
                              {dish.selectedSpiciness && (
                                <div className="flex items-center gap-1 text-xs md:text-sm text-orange-400 font-bold">
                                  <Flame className="w-3 h-3 md:w-4 md:h-4" />
                                  {dish.selectedSpiciness}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {dish.toppings?.length > 0 && (
                              <div>
                                <div className="flex flex-wrap gap-1">
                                  {dish.toppings.map((topping, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-xs md:text-sm"
                                    >
                                      <Image src={"/toppings.png"} alt="Topping" width={14} height={14} className="w-3 h-3 scale-175" />
                                      {topping.name}
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
                                      className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-xs md:text-sm"
                                    >
                                      <Image src={"/extras.png"} alt="Extra" width={14} height={14} className="w-3 h-3 scale-125" />
                                      {extra.name}
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

                          <div className="flex items-center justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                            <span className="text-sm md:text-base font-medium md:hidden">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQty(vendorGroup.vendorId, dish, -1)
                                }
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm md:text-base">
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
                          </div>

                          <div className="flex items-center justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0">
                            <span className="text-sm md:text-base font-medium md:hidden">Total:</span>
                            <span className="text-sm md:text-base font-semibold">
                              ${dish.total}
                            </span>
                          </div>

                          <div className="flex justify-end md:justify-center border-t md:border-t-0 pt-3 md:pt-0">
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

        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-200 h-fit sticky top-4">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between text-sm md:text-base text-gray-600">
              <span>Items ({totalItems})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base text-gray-600">
              <span>Delivery Fee</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm md:text-base text-gray-600">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-3 md:pt-4">
              <div className="flex justify-between font-bold text-base md:text-lg">
                <span>SubTotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-rose-600 text-white py-2.5 md:py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
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
