"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { FaStar, FaUser } from "react-icons/fa";
import { Timer, AlertCircle, Eye, BadgeCheck, X, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { updateCartAndNotify } from "@/app/lib/utils";
import Link from "next/link";
import { getCookie } from "cookies-next";
import VerificationBadge from "@/app/components/VerificationBadge";

const API_ERROR_MESSAGES = {
  CONFIG_MISSING: "We're having trouble with our configuration. Please contact our support team.",
  FETCH_ERROR: "We're having trouble loading dish details right now. Please try again later.",
  NOT_FOUND: "Sorry, we couldn't find the dish you're looking for.",
  CART_ERROR: "We couldn't add this item to your cart right now. Please try again.",
  SELECTION_ERROR: "We couldn't update your selection right now. Please try again.",
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
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const modalRef = useRef(null);

  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

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
        extras: dishInfo.extras?.map((extra) => ({
          ...extra,
          price: Number(extra.price) || 0,
        })) || [],
        toppings: dishInfo.toppings?.map((topping) => ({
          ...topping,
          price: Number(topping.price) || 0,
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

      // Set initial spiciness level if available
      if (enhancedDishInfo.spiciness && enhancedDishInfo.spiciness.length > 0) {
        setSelectedSpiceLevel(enhancedDishInfo.spiciness[0]);
      } else {
        setSelectedSpiceLevel(null);
      }

      const initialToppings = {};
      enhancedDishInfo.toppings?.forEach((topping) => {
        initialToppings[topping.name] = { selected: false, price: topping.price };
      });
      setSelectedToppings(initialToppings);

      const initialExtras = {};
      enhancedDishInfo.extras?.forEach((extra) => {
        initialExtras[extra.name] = { selected: false, price: extra.price };
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
      setSelectedToppings({});
      setSelectedExtras({});
      setVendorDetails(null);
      fetchDishDetails();

      const zipcode = localStorage.getItem("zipcode");
      if (!zipcode) {
        toast.error("Please set your delivery location to continue");
        onClose();
        return;
      }
      setUserZipcode(zipcode);
    }
  }, [dishId, fetchDishDetails, onClose]); // Removed isOpen dependency to prevent unnecessary resets



  const calculateTotalPrice = () => {
    if (!dishDetails) return 0;

    const extrasTotal = Object.values(selectedExtras)
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.price), 0);
    
    const toppingsTotal = Object.values(selectedToppings)
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.price), 0);
    
    return (
      (Number(dishDetails.price) + extrasTotal + toppingsTotal) * orderQuantity
    );
  };

  const handleAddToCart = () => {
    try {
      // Get all selected extras
      const allExtras = Object.entries(selectedExtras)
        .filter(([name, item]) => item.selected)
        .map(([name, item]) => ({
          name,
          price: Number(item.price),
        }));

      // Get all selected toppings
      const allToppings = Object.entries(selectedToppings)
        .filter(([name, item]) => item.selected)
        .map(([name, item]) => ({
          name,
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
        selectedSpiciness: selectedSpiceLevel || "Not specified",
        toppings: allToppings,
        extras: allExtras,
        total: calculateTotalPrice().toFixed(2),
      };

      if (vendorGroupIndex > -1) {
        const existingDishIndex = cart[vendorGroupIndex].dishes.findIndex(
          (dish) => {
            // Check if it's the same dish
            if (dish.id !== dishDetails.documentId) return false;
            
            // Check if spiciness matches
            if (dish.selectedSpiciness !== (selectedSpiceLevel || "Not specified")) return false;
            
            // Check if toppings match exactly
            if (dish.toppings.length !== allToppings.length) return false;
            const toppingsMatch = allToppings.every((topping, index) => 
              dish.toppings[index]?.name === topping.name
            );
            if (!toppingsMatch) return false;
            
            // Check if extras match exactly
            if (dish.extras.length !== allExtras.length) return false;
            const extrasMatch = allExtras.every((extra, index) => 
              dish.extras[index]?.name === extra.name
            );
            if (!extrasMatch) return false;
            
            return true;
          }
        );

        if (existingDishIndex > -1) {
          // Update quantity of existing item
          cart[vendorGroupIndex].dishes[existingDishIndex].quantity += orderQuantity;
          cart[vendorGroupIndex].dishes[existingDishIndex].total = (
            (Number(cart[vendorGroupIndex].dishes[existingDishIndex].basePrice) + 
             allToppings.reduce((sum, t) => sum + t.price, 0) + 
             allExtras.reduce((sum, e) => sum + e.price, 0)) * 
            cart[vendorGroupIndex].dishes[existingDishIndex].quantity
          ).toFixed(2);
        } else {
          cart[vendorGroupIndex].dishes.push(newDishItem);
        }
      } else {
        // Construct vendor address from vendor details
        const vendorAddress = vendorDetails?.businessAddress && vendorDetails?.city && vendorDetails?.zipcode 
          ? `${vendorDetails.businessAddress}, ${vendorDetails.city}, ${vendorDetails.zipcode}`
          : vendorDetails?.businessAddress || "Address not available";
        
        cart.push({
          vendorId: dishDetails.vendorId,
          vendorName: vendorDetails?.storeName || "Unknown Chef",
          vendorUsername: vendorDetails?.username || "",
          vendorAvatar: vendorDetails?.avatar?.url || "/fallback.png",
          vendorAddress: vendorAddress,
          dishes: [newDishItem],
        });
      }

      updateCartAndNotify(cart);
      
      toast.success(
        `Great! ${orderQuantity} ${dishDetails.name} has been added to your cart!`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(API_ERROR_MESSAGES.CART_ERROR);
      console.error("Error adding to cart:", error);
    }
  };

  const handleOptionSelect = (type, name) => {
    try {
      if (type === "topping") {
        setSelectedToppings((prev) => ({
          ...prev,
          [name]: { 
            ...prev[name], 
            selected: !prev[name].selected 
          },
        }));
      } else if (type === "extra") {
        setSelectedExtras((prev) => ({
          ...prev,
          [name]: { 
            ...prev[name], 
            selected: !prev[name].selected 
          },
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
        className={`inline w-4 h-4 ${index < Math.round(rating) ? "text-yellow-400" : "text-slate-400"
          }`}
      />
    ));

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors absolute top-2 right-2 z-10"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="p-10 text-center flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : isDishNotFound || !dishDetails ? (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <div className="text-3xl text-gray-600 mb-4">Dish not found</div>
            <p className="text-gray-500 mb-4">
              The dish you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={onClose}
              className="bg-rose-600 text-white px-4 py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-4 sm:p-6">
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
                    <div className="mt-4">
                      <div className="text-sm text-gray-600">
                        <h3 className="font-bold text-lg mb-2">Description</h3>
                        {dishDetails.description ? (
                          <p className="text-gray-700 leading-relaxed">{dishDetails.description}</p>
                        ) : (
                          <p className="text-gray-400 italic">No description available for this dish.</p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-2 sm:gap-4 mt-4">
                          <p className="font-bold text-md flex items-center gap-x-1 text-gray-700">
                            <Timer className="w-5 h-5" />
                            {dishDetails.preparation_time ? `${dishDetails.preparation_time} Minutes` : "Preparation time not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
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

                    <div className="flex flex-row items-center gap-4 text-sm text-gray-500">
                      <div>
                        {dishDetails.category ? (
                          <span className="capitalize">
                            {dishDetails.category.replace(/-/g, " ")}
                          </span>
                        ) : (
                          <span className="text-gray-400">No category</span>
                        )}
                        {" · "}
                        {dishDetails.subcategory ? (
                          <span className="text-green-500 font-bold capitalize">
                            {dishDetails.subcategory.replace(/-/g, " ")}
                          </span>
                        ) : (
                          <span className="text-gray-400">No subcategory</span>
                        )}
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <FaStar /> {dishDetails.rating || 0}
                        <span className="text-gray-600 text-sm ml-1">
                          ({dishDetails.reviews?.length || 0})
                        </span>
                      </div>
                      <div className="bg-slate-200 rounded px-2 py-1 flex items-center gap-1 w-fit">
                        <span className="font-bold flex items-center gap-1">
                          Servings <FaUser />
                        </span>{" "}
                        {dishDetails.servings || "N/A"}
                      </div>
                    </div>

                    {dishDetails.spiciness && dishDetails.spiciness.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
                          <h3>Spiciness</h3>
                        </div>
                        <div className="flex items-center justify-end space-x-2 flex-wrap gap-2">
                          {dishDetails.spiciness.map((level, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSpiceLevel(level)}
                              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 min-w-fit
                              ${selectedSpiceLevel === level
                                  ? "bg-red-500 text-white border-red-500 shadow-md"
                                  : "bg-white text-red-500 border-red-500 hover:bg-red-50 hover:border-red-600"
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

                        <div className="flex flex-wrap gap-2 justify-end">
                          {dishDetails.toppings.map((topping, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleOptionSelect("topping", topping.name)
                              }
                              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize whitespace-nowrap
                                ${selectedToppings[topping.name]?.selected
                                  ? "bg-red-500 text-white border-red-500"
                                  : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                                }`}
                            >
                              {topping.name}
                            </button>
                          ))}
                        </div>
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

                        <div className="flex flex-wrap gap-2 justify-end">
                          {dishDetails.extras.map((extra, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleOptionSelect("extra", extra.name)
                              }
                              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize whitespace-nowrap
                                ${selectedExtras[extra.name]?.selected
                                  ? "bg-red-500 text-white border-red-500"
                                  : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                                }`}
                            >
                              {extra.name} 
                            </button>
                          ))}
                        </div>
                      </div>
                    )}


                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <div className="flex gap-4 sm:gap-6 border-b pb-2 overflow-x-auto scrollbar-hide">
                    {["ingredients", "reviews"].map((section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`pb-1 border-b-2 whitespace-nowrap ${activeSection === section
                          ? "text-red-600 border-red-600 font-semibold"
                          : "text-gray-500 border-transparent"
                          }`}
                      >
                        {section === "ingredients" ? "Ingredients" : "Reviews"}
                      </button>
                    ))}
                  </div>

                  {activeSection === "ingredients" && (
                    <div className="mt-6">
                      {dishDetails.ingredients && dishDetails.ingredients.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {dishDetails.ingredients.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center p-4 border border-gray-200 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center min-h-[100px] gap-2"
                            >
                              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2">
                                <img
                                  src="/ingredients.png"
                                  width={40}
                                  height={40}
                                  alt={item}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-700 text-center capitalize leading-tight px-2 break-words">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <img
                                src="/ingredients.png"
                                width={32}
                                height={32}
                                alt="No ingredients"
                                className="opacity-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-gray-700">No ingredients listed</h3>
                              <p className="text-sm text-gray-500">This dish doesn&apos;t have ingredients information available.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "reviews" && (
                    <div className="mt-6">
                      {dishDetails.reviews && dishDetails.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {dishDetails.reviews.map((review, idx) => (
                            <div key={idx} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-800 capitalize">
                                  {review.name || "Anonymous"}
                                </p>
                                <div className="flex gap-1">
                                  {renderRatingStars(review.rating || 0)}
                                </div>
                              </div>
                              {review.text && (
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                  {review.text}
                                </p>
                              )}
                              {review.image && (
                                <div className="mt-3">
                                  <img
                                    src={review.image.url || review.image}
                                    alt="Review image"
                                    className="w-10 bg max-w-xs h-auto rounded-lg border border-gray-200 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleImageClick(review.image.url || review.image)}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-gray-700">No reviews yet</h3>
                              <p className="text-sm text-gray-500">Be the first to review this dish!</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed bottom section with quantity selector and Add to Cart button */}
            <div className="border-t bg-white sm:px-4 px-1 py-2 rounded-b-2xl">
              <div className="flex flex-row items-center gap-2">
                <div className="bg-rose-600 text-white rounded-full flex items-center gap-2 p-2">
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
                  className="w-full bg-rose-600 text-white py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
          </>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeFullScreenImage}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeFullScreenImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            <img
              src={fullScreenImage}
              alt="Full screen review image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}