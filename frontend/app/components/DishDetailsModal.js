"use client";
import { useState, useEffect, useCallback } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { FaStar, FaUser } from "react-icons/fa";
import { Timer, AlertCircle, Eye, BadgeCheck, X } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { getCookie } from "cookies-next";
import VerificationBadge from "@/app/components/VerificationBadge";

const API_ERROR_MESSAGES = {
  CONFIG_MISSING: "API configuration is missing. Please contact support.",
  FETCH_ERROR: "Unable to fetch dish details. Please try again later.",
  NOT_FOUND: "The requested dish could not be found.",
  CART_ERROR: "Failed to add item to cart. Please try again.",
  SELECTION_ERROR: "Failed to update selection. Please try again.",
};

export default function DishDetailsModal({ isOpen, onClose, dishId }) {
  const [dishDetails, setDishDetails] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);
  const [isDishNotFound, setIsDishNotFound] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("ingredients");
  const [selectedExtras, setSelectedExtras] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [userZipcode, setUserZipcode] = useState(null);
  const [isVendorBanned, setIsVendorBanned] = useState(false);

  const fetchVendorDetails = useCallback(async (vendorId) => {
    if (!vendorId) return;
    try {
      if (
        !process.env.NEXT_PUBLIC_STRAPI_HOST ||
        !process.env.NEXT_PUBLIC_STRAPI_TOKEN
      ) {
        throw new Error(API_ERROR_MESSAGES.CONFIG_MISSING);
      }

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

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error?.message || API_ERROR_MESSAGES.FETCH_ERROR
        );
      }

      if (!responseData.data) {
        throw new Error(API_ERROR_MESSAGES.NOT_FOUND);
      }

      setVendorDetails(responseData.data);

      // Check if vendor is banned
      const vendorStatus = responseData.data.verificationStatus;
      setIsVendorBanned(vendorStatus === "banned");
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error(error.message || API_ERROR_MESSAGES.FETCH_ERROR);
    }
  }, []);

  const fetchDishDetails = useCallback(async () => {
    if (!dishId) return;

    try {
      if (
        !process.env.NEXT_PUBLIC_STRAPI_HOST ||
        !process.env.NEXT_PUBLIC_STRAPI_TOKEN
      ) {
        throw new Error(API_ERROR_MESSAGES.CONFIG_MISSING);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error?.message || API_ERROR_MESSAGES.FETCH_ERROR
        );
      }

      if (!responseData.data) {
        throw new Error(API_ERROR_MESSAGES.NOT_FOUND);
      }

      const dishInfo = responseData.data;
      const enhancedDishInfo = {
        ...dishInfo,
        extras:
          dishInfo.extras?.map((extra) => ({
            ...extra,
            options: [
              { label: "None", price: 0 },
              ...extra.options.map((option) => ({
                ...option,
                price: Number(option.price) || 0,
              })),
            ],
          })) || [],
        toppings:
          dishInfo.toppings?.map((topping) => ({
            ...topping,
            options: [
              { label: "None", price: 0 },
              ...topping.options.map((option) => ({
                ...option,
                price: Number(option.price) || 0,
              })),
            ],
          })) || [],
        image: {
          id: dishInfo.image?.id || null,
          url: dishInfo.image?.url || "/fallback.png",
        },
        reviews: dishInfo.reviews || [],
        ingredients: dishInfo.ingredients || [],
        spiciness: dishInfo.spiciness || [],
      };

      // Fetch vendor details after dish details are fetched
      if (dishInfo.vendorId) {
        await fetchVendorDetails(dishInfo.vendorId);
      }

      const user = getCookie("user");
      setIsPreview(dishInfo.email === user);
      setIsAvailable(dishInfo.available);
      setDishDetails(enhancedDishInfo);

      setSelectedSpiceLevel(enhancedDishInfo.spiciness?.[0]);

      const initialToppings = {};
      enhancedDishInfo.toppings?.forEach((topping) => {
        initialToppings[topping.name] = { selected: "None", price: 0 };
      });
      setSelectedToppings(initialToppings);

      const initialExtras = {};
      enhancedDishInfo.extras?.forEach((extra) => {
        initialExtras[extra.name] = { selected: "None", price: 0 };
      });
      setSelectedExtras(initialExtras);

      setIsDishNotFound(false);
    } catch (error) {
      console.error("Error fetching dish:", error);
      toast.error(error.message || API_ERROR_MESSAGES.FETCH_ERROR);
      setIsDishNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [dishId, fetchVendorDetails]);

  useEffect(() => {
    if (isOpen && dishId) {
      setLoading(true);
      setIsDishNotFound(false);
      setOrderQuantity(1);
      setActiveSection("ingredients");
      setSelectedSpiceLevel(null);
      setSelectedExtras({});
      setSelectedToppings({});
      setVendorDetails(null);
      fetchDishDetails();

      const zipcode = localStorage.getItem("zipcode");
      if (!zipcode) {
        toast.error("Please set your zipcode");
        onClose();
        return;
      }
      setUserZipcode(zipcode);
    }
  }, [isOpen, dishId, fetchDishDetails, onClose]);

  const calculateTotalPrice = () => {
    if (!dishDetails) return 0;

    const extrasTotal = Object.values(selectedExtras).reduce(
      (sum, item) => sum + Number(item.price),
      0
    );
    const toppingsTotal = Object.values(selectedToppings).reduce(
      (sum, item) => sum + Number(item.price),
      0
    );
    return (
      (Number(dishDetails.price) + extrasTotal + toppingsTotal) * orderQuantity
    );
  };

  const handleAddToCart = () => {
    try {
      const activeExtras = Object.entries(selectedExtras)
        .filter(([, item]) => item.price > 0)
        .map(([name, item]) => ({
          name,
          option: item.selected,
          price: Number(item.price),
        }));

      const activeToppings = Object.entries(selectedToppings)
        .filter(([, item]) => item.price > 0)
        .map(([name, item]) => ({
          name,
          option: item.selected,
          price: Number(item.price),
        }));

      let cart = [];
      try {
        const savedCart = localStorage.getItem("cart");
        cart = savedCart ? JSON.parse(savedCart) : [];
        if (!Array.isArray(cart)) {
          cart = [];
        }
      } catch (error) {
        console.error("Error parsing cart:", error);
        cart = [];
      }

      const vendorGroupIndex = cart.findIndex(
        (group) => group.vendorId === dishDetails.vendorId
      );

      const newDishItem = {
        id: dishDetails.documentId,
        name: dishDetails.name,
        image: { id: dishDetails.image?.id, url: dishDetails.image?.url },
        basePrice: dishDetails.price,
        quantity: orderQuantity,
        selectedSpiciness: selectedSpiceLevel,
        toppings: activeToppings,
        extras: activeExtras,
        total: calculateTotalPrice().toFixed(2),
      };

      if (vendorGroupIndex > -1) {
        const existingDishIndex = cart[vendorGroupIndex].dishes.findIndex(
          (dish) =>
            dish.id === dishDetails.documentId &&
            dish.selectedSpiciness === selectedSpiceLevel &&
            JSON.stringify(dish.toppings) === JSON.stringify(activeToppings) &&
            JSON.stringify(dish.extras) === JSON.stringify(activeExtras)
        );

        if (existingDishIndex > -1) {
          cart[vendorGroupIndex].dishes[existingDishIndex].quantity +=
            orderQuantity;
          cart[vendorGroupIndex].dishes[existingDishIndex].total = (
            Number(cart[vendorGroupIndex].dishes[existingDishIndex].basePrice) *
            cart[vendorGroupIndex].dishes[existingDishIndex].quantity
          ).toFixed(2);
        } else {
          cart[vendorGroupIndex].dishes.push(newDishItem);
        }
      } else {
        cart.push({
          vendorId: dishDetails.vendorId,
          vendorName: vendorDetails?.storeName || "Unknown Chef",
          vendorUsername: vendorDetails?.username || "",
          vendorAvatar: vendorDetails?.avatar?.url || "/fallback.png",
          dishes: [newDishItem],
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success(
        `Successfully added ${orderQuantity} ${dishDetails.name} to your cart!`
      );
    } catch (error) {
      toast.error(API_ERROR_MESSAGES.CART_ERROR);
      console.error("Error adding to cart:", error);
    }
  };

  const handleOptionSelect = (type, name, option, price) => {
    try {
      if (type === "topping") {
        setSelectedToppings((prev) => ({
          ...prev,
          [name]: { selected: option, price: Number(price) },
        }));
      } else if (type === "extra") {
        setSelectedExtras((prev) => ({
          ...prev,
          [name]: { selected: option, price: Number(price) },
        }));
      }
    } catch (error) {
      toast.error(API_ERROR_MESSAGES.SELECTION_ERROR);
      console.error("Error updating selection:", error);
    }
  };

  const renderRatingStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`inline w-4 h-4 ${
          index < Math.round(rating) ? "text-yellow-400" : "text-slate-400"
        }`}
      />
    ));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative hide-scrollbar pt-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-2 right-2 z-10"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="p-8 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading dish details...
            </p>
          </div>
        ) : isDishNotFound || !dishDetails ? (
          <div className="p-8 text-center">
            <div className="text-3xl text-gray-600 mb-4">Dish not found</div>
            <p className="text-gray-500 mb-4">
              The dish you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 hide-scrollbar">
            <div className="space-y-2 mb-4">
              {!isAvailable && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center capitalize font-bold flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  This dish is currently unavailable
                </div>
              )}
              {!(userZipcode == dishDetails.zipcode) && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center capitalize font-bold flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  This dish is unavailable in your city
                </div>
              )}
              {isVendorBanned && (
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center capitalize font-bold flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  This vendor has been banned
                </div>
              )}
              {isPreview && (
                <div className="bg-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-center capitalize font-bold flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  You are viewing this dish in preview mode
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <img
                  src={dishDetails.image?.url || "/fallback.png"}
                  width={400}
                  height={300}
                  alt={dishDetails.name}
                  className="rounded-xl w-full object-cover aspect-video"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-bold capitalize">
                    {dishDetails.name}
                  </h1>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    ${calculateTotalPrice().toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-2 sm:gap-4 text-sm text-gray-500">
                  <div>
                    {dishDetails.category
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                    ·{" "}
                    <span className="text-green-500 font-bold truncate capitalize">
                      {dishDetails.subcategory.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <FaStar /> {dishDetails.rating}
                    <span className="text-gray-600 text-sm">
                      ({dishDetails.reviews.length})
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded px-2 py-1 flex items-center gap-1 w-fit">
                    <span className="font-bold flex items-center gap-1">
                      Servings <FaUser />
                    </span>{" "}
                    {dishDetails.servings}
                  </div>
                </div>

                {dishDetails.spiciness?.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
                      <h3>Spiciness</h3>
                    </div>
                    <div className="flex items-center justify-end space-x-2 flex-wrap">
                      {dishDetails.spiciness?.map((level, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSpiceLevel(level)}
                          className={`px-4 py-1 rounded-full border text-xs font-medium transition-all
                          ${
                            selectedSpiceLevel === level
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-red-500 border-red-500"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {dishDetails.toppings?.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between">
                      <h3>Toppings</h3>
                      <p className="text-gray-400 text-xs">
                        Additional Charges Apply
                      </p>
                    </div>

                    {dishDetails.toppings.map((topping, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                      >
                        <span className="text-gray-800 capitalize truncate">
                          {topping.name}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {topping.options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                handleOptionSelect(
                                  "topping",
                                  topping.name,
                                  option.label,
                                  option.price
                                )
                              }
                              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all capitalize truncate
                                ${
                                  selectedToppings[topping.name]?.selected ===
                                  option.label
                                    ? "bg-red-500 text-white"
                                    : "bg-white text-red-500 border-red-500"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dishDetails.extras?.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between">
                      <h3>Extras</h3>
                      <p className="text-gray-400 text-xs">
                        Additional Charges Apply
                      </p>
                    </div>

                    {dishDetails.extras.map((extra, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                      >
                        <span className="text-gray-800 capitalize truncate">
                          {extra.name}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {extra.options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                handleOptionSelect(
                                  "extra",
                                  extra.name,
                                  option.label,
                                  option.price
                                )
                              }
                              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all capitalize truncate
                                ${
                                  selectedExtras[extra.name]?.selected ===
                                  option.label
                                    ? "bg-red-500 text-white"
                                    : "bg-white text-red-500 border-red-500"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="my-6 sm:my-8">
                  <div className="text-sm text-rose-500 font-bold mb-3 flex items-center gap-2">
                    <span className="bg-rose-50 p-1 rounded-full">
                      <FaStar className="text-rose-500" size={12} />
                    </span>
                    Prepared by
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={vendorDetails?.avatar?.url || "/fallback.png"}
                          alt={vendorDetails?.storeName || "Chef"}
                          width={64}
                          height={64}
                          className="rounded-full w-16 h-16 object-cover shadow-md"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-md font-semibold text-gray-800">
                          {vendorDetails?.storeName || "Unknown Chef"}
                        </span>
                        {vendorDetails?.username && (
                          <Link
                            href={`/vendors/@${vendorDetails?.username}`}
                            className="text-gray-500 text-xs hover:text-rose-500 hover:underline flex items-center gap-1"
                          >
                            <span className="bg-gray-100 p-1 rounded-full">
                              <FaUser size={10} />
                            </span>
                            @{vendorDetails?.username}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-start sm:items-end gap-2">
                      <VerificationBadge
                        status={vendorDetails?.verificationStatus}
                      />
                      <div className="text-sm text-yellow-500 flex items-center gap-1.5 bg-yellow-50 py-0.5 px-3 rounded-full w-fit">
                        <FaStar size={14} />
                        <span className="font-medium">
                          {vendorDetails?.rating || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-rose-500 text-white rounded-full flex items-center gap-2 p-2">
                    <button
                      onClick={() =>
                        setOrderQuantity((q) => Math.max(1, q - 1))
                      }
                      className="hover:bg-rose-400 rounded-full p-1"
                    >
                      <LuMinus size={16} />
                    </button>
                    <span className="w-7 text-center">{orderQuantity}</span>
                    <button
                      onClick={() => setOrderQuantity((q) => q + 1)}
                      className="hover:bg-rose-400 rounded-full p-1"
                    >
                      <LuPlus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      isPreview ||
                      !isAvailable ||
                      !(userZipcode == dishDetails.zipcode) ||
                      isVendorBanned
                    }
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex gap-4 sm:gap-6 border-b pb-2 overflow-x-auto scrollbar-hide">
                {["ingredients", "description", "reviews"].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`pb-1 border-b-2 whitespace-nowrap ${
                      activeSection === section
                        ? "text-red-600 border-red-600 font-semibold"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    {section === "ingredients"
                      ? "Ingredients"
                      : section === "description"
                      ? "Description"
                      : "Reviews"}
                  </button>
                ))}
              </div>

              {activeSection === "ingredients" && (
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-6 flex-wrap">
                  {dishDetails.ingredients?.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col py-4 border bg-slate-50 rounded-lg w-20 h-20 sm:w-24 sm:h-24 shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
                    >
                      <img
                        src="/ingredients.png"
                        width={30}
                        height={30}
                        alt={item}
                        className="mx-auto"
                      />
                      <span className="mt-2 text-xs font-medium text-center capitalize truncate">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "description" && (
                <div className="text-sm text-gray-600 mt-6">
                  <p>{dishDetails.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-2 sm:gap-4 mt-4">
                    <h2 className="font-bold text-lg flex items-center gap-x-1">
                      <Timer className="w-5 h-5" /> Preparation Time
                    </h2>
                    <p>{dishDetails.preparation_time} minutes</p>
                  </div>
                </div>
              )}

              {activeSection === "reviews" && (
                <div className="mt-6 space-y-4">
                  {dishDetails.reviews?.length > 0 ? (
                    dishDetails.reviews.map((review, idx) => (
                      <div key={idx} className="border p-4 rounded-lg">
                        <p className="text-sm font-semibold">{review.name}</p>
                        <div className="flex gap-1 mt-1">
                          {renderRatingStars(review.rating)}
                        </div>
                        <p className="text-sm mt-2">{review.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-2">No reviews yet</div>
                      <p className="text-sm text-gray-400">
                        Be the first to review this dish!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
