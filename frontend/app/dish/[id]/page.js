"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { FaStar, FaUser } from "react-icons/fa";
import { Timer } from "lucide-react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { toast } from "react-toastify";

export default function DishPage() {
  const { id } = useParams();
  const [dishDetails, setDishDetails] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);
  const [isDishNotFound, setIsDishNotFound] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("ingredients");
  const [selectedExtras, setSelectedExtras] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDishDetails = async () => {
    try {
      if (
        !process.env.NEXT_PUBLIC_STRAPI_HOST ||
        !process.env.NEXT_PUBLIC_STRAPI_TOKEN
      ) {
        toast.error("API configuration is missing");
        throw new Error("API configuration is missing");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${id}?populate=*`,
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
        toast.error(
          responseData.error?.message || "Failed to fetch dish details"
        );
        throw new Error(
          responseData.error?.message || "Failed to fetch dish details"
        );
      }

      if (!responseData.data) {
        toast.error("Dish not found");
        throw new Error("Dish not found");
      }

      const dishInfo = responseData.data;
      const enhancedDishInfo = {
        ...dishInfo,
        extras:
          dishInfo.extras?.map((extra) => ({
            ...extra,
            options: [{ label: "None", price: 0 }, ...extra.options],
          })) || [],
        toppings:
          dishInfo.toppings?.map((topping) => ({
            ...topping,
            options: [{ label: "None", price: 0 }, ...topping.options],
          })) || [],
        image: {
          id: dishInfo.image?.id || null,
          url: dishInfo.image?.url || "/fallback.png",
        },
        chef: {
          ...dishInfo.chef,
          avatar: {
            id: dishInfo.chef?.avatar?.id || null,
            url: dishInfo.chef?.avatar?.url || "/fallback.png",
          },
        },
        reviews: dishInfo.reviews || [],
        ingredients: dishInfo.ingredients || [],
        spiciness: dishInfo.spiciness || [],
      };

      setDishDetails(enhancedDishInfo);
      setSelectedSpiceLevel(enhancedDishInfo.spiciness?.[0]);

      // Initialize toppings state
      const initialToppings = {};
      enhancedDishInfo.toppings?.forEach((topping) => {
        initialToppings[topping.name] = {
          selected: "None",
          price: 0,
        };
      });
      setSelectedToppings(initialToppings);

      // Initialize extras state
      const initialExtras = {};
      enhancedDishInfo.extras?.forEach((extra) => {
        initialExtras[extra.name] = {
          selected: "None",
          price: 0,
        };
      });
      setSelectedExtras(initialExtras);

      setIsDishNotFound(false);
    } catch (error) {
      console.error("Error fetching dish:", error.message);
      toast.error(error.message || "Failed to load dish details");
      setIsDishNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDishDetails();
    } else {
      setIsDishNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const calculateTotalPrice = () => {
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

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.id === dishDetails.documentId &&
          item.selectedSpiciness === selectedSpiceLevel &&
          JSON.stringify(item.toppings) === JSON.stringify(activeToppings) &&
          JSON.stringify(item.extras) === JSON.stringify(activeExtras)
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += orderQuantity;
        cart[existingItemIndex].total = calculateTotalPrice().toFixed(2);
      } else {
        cart.push({
          id: dishDetails.documentId,
          name: dishDetails.name,
          image: { id: dishDetails.image.id, url: dishDetails.image.url },
          basePrice: dishDetails.price,
          chef: dishDetails.chef,
          vendorId: dishDetails.vendorId,
          quantity: orderQuantity,
          selectedSpiciness: selectedSpiceLevel,
          toppings: activeToppings,
          extras: activeExtras,
          total: calculateTotalPrice().toFixed(2),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success(`${dishDetails.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", error);
    }
  };

  const handleOptionSelect = (type, name, option, price) => {
    try {
      if (type === "topping") {
        setSelectedToppings((prev) => ({
          ...prev,
          [name]: {
            selected: option,
            price: Number(price),
          },
        }));
      } else {
        setSelectedExtras((prev) => ({
          ...prev,
          [name]: {
            selected: option,
            price: Number(price),
          },
        }));
      }
    } catch (error) {
      toast.error("Failed to update selection");
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

  if (loading) return <Loading />;

  if (isDishNotFound || !dishDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-3xl text-center text-gray-600">Dish not found</div>
        <p className="text-gray-500">
          The dish you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white text-gray-800 mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
          <div>
            <Image
              src={dishDetails.image?.url || "/fallback.png"}
              width={400}
              height={300}
              alt={dishDetails.name}
              className="rounded-xl w-full object-cover aspect-video"
            />
          </div>

          <div className="space-y-4 p-4 h-fit">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {dishDetails.name.replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <div className="text-2xl font-bold text-red-600">
                ${calculateTotalPrice().toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-start gap-4 text-sm text-gray-500">
              <div>
                {dishDetails.category
                  .replace("-", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                ·{" "}
                <span className="text-green-500 font-bold">
                  {dishDetails.subcategory.replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
                </span>
              </div>
              <div className="flex items-center text-yellow-400">
                <FaStar /> {dishDetails.rating}
                <span className="text-gray-600 text-sm">
                  ({dishDetails.reviews.length})
                </span>
              </div>
              <div className="bg-slate-200 rounded px-2 py-1 flex items-center gap-1">
                <span className="font-bold flex items-center gap-1">
                  Servings <FaUser />
                </span>{" "}
                {dishDetails.servings}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
                <h3>Spiciness</h3>
              </div>
              <div className="flex items-center justify-end space-x-2">
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

            {dishDetails.toppings?.length > 0 && (
              <div className="space-y-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between">
                  <h3>Toppings</h3>
                  <p className="text-gray-400">Additional Charges Apply</p>
                </div>

                {dishDetails.toppings.map((topping, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-800">{topping.name}</span>
                    <div className="flex gap-2">
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
                          className={`px-4 py-1 rounded-full border text-xs font-medium transition-all
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
                  <p className="text-gray-400">Additional Charges Apply</p>
                </div>

                {dishDetails.extras.map((extra, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center flex-wrap"
                  >
                    <span className="text-gray-800">{extra.name}</span>
                    <div className="flex gap-y-4 gap-x-2 flex-wrap">
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
                          className={`px-4 py-1 rounded-full border text-xs font-medium transition-all
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

            <div className="gap-2 my-8">
              <div className="text-sm text-rose-500 font-bold mb-2">
                Prepared by
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={dishDetails.chef?.avatar?.url || "/fallback.png"}
                  alt={dishDetails.chef?.name || "Chef"}
                  width={48}
                  height={48}
                  className="rounded-full w-12 h-12 object-cover"
                />
                <span className="text-sm font-semibold">
                  {dishDetails.chef?.name}
                </span>
                <div className="text-sm text-yellow-400 flex items-center gap-1">
                  <FaStar />
                  {dishDetails.chef?.rating || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-rose-500 text-white rounded-full flex items-center gap-2 p-2">
                <button
                  onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
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
                className="w-full bg-rose-600 text-white py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex gap-6 border-b pb-2">
            {["ingredients", "description", "reviews"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`pb-1 border-b-2 ${
                  activeSection === section
                    ? "text-red-600 border-red-600 font-semibold"
                    : "text-gray-500 border-transparent"
                }`}
              >
                {section === "ingredients"
                  ? "Ingredients"
                  : section === "description"
                  ? "Description"
                  : "Ratings & reviews"}
              </button>
            ))}
          </div>

          {activeSection === "ingredients" && (
            <div className="flex items-center md:justify-start justify-center gap-4 mt-6 flex-wrap">
              {dishDetails.ingredients?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 border bg-slate-50 rounded-lg w-24 h-24"
                >
                  <Image
                    src="/ingredients.png"
                    width={30}
                    height={30}
                    alt={item}
                    className="mx-auto"
                  />
                  <span className="mt-2 text-xs font-medium text-center">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSection === "description" && (
            <div className="text-sm text-gray-600 mt-6">
              <p>{dishDetails.description}</p>
              <div className="flex items-center justify-start gap-x-4 mt-4">
                <h2 className="font-bold text-lg flex items-center gap-x-1">
                  <Timer /> Preparation Time
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
    </>
  );
}
