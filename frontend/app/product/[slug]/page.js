"use client";
import Loading from "@/app/loading";
import Custom404 from "@/app/not-found";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCartArrowDown, FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { GiHotSpices } from "react-icons/gi";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ProductReviewPopup from "@/app/components/ProductReviewPopup";
import DeliciousDeals from "@/app/HomeComponents/deliciousDeals";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { slug } = useParams();
  const productId = searchParams.get("productId");

  const [dish, setDish] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiciness, setSelectedSpiciness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [user, setUser] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const getCookie = (name) => {
      const cookieArr = document.cookie.split(";");
      for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    };

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");
    setUser(storedUser);

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (slug && productId && user) {
      fetchDish();
    }
  }, [slug, productId, user]);
  const handleOpenPopup = () => {
    if (!hasReviewed) {
      setIsReviewPopupOpen(true);
    } else {
      toast.info("You have already reviewed this product.");
    }
  };

  const handleClosePopup = () => {
    setIsReviewPopupOpen(false);
  };

  useEffect(() => {
    if (vendor && user && vendor?.email === user) {
      setIsPreviewMode(true);
    }
  }, [vendor, user]);
  const getShortDayName = () => {
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = new Date().getDay();
    return shortDayNames[dayOfWeek];
  };

  const fetchDish = async () => {
    setLoading(true);
    setProductNotFound(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${slug}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch vendor");

      const data = await response.json();
      if (!data?.data) {
        setProductNotFound(true);
        return;
      }

      setVendor(data.data);
      const foundDish = data.data.menu?.find((dish) => dish.id == productId);

      if (!foundDish) {
        setProductNotFound(true);
        return;
      }

      setDish(foundDish);
      setSelectedSpiciness(foundDish.spiciness?.[0]);

      if (foundDish.reviews?.some((review) => review.user_name === user)) {
        setHasReviewed(true);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error("An error occurred while fetching the vendor");
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleSpicinessSelect = (s) => setSelectedSpiciness(s);

  const addToCart = () => {
    if (!selectedSpiciness) {
      toast.error("Please select a spiciness level.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === dish.id &&
        item.selectedSpiciness === selectedSpiciness
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        ...dish,
        productId: dish.id,
        quantity,
        selectedSpiciness,
        vendorID: slug,
        vendor_name: vendor.name,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${dish.name} added to cart`);
  };

  if (loading) return <Loading />;
  if (productNotFound) return <Custom404 />;

  return (
    <>
      {isPreviewMode && (
        <div className="bg-red-500 text-white text-center py-2 mt-5 w-[80%] mx-auto font-bold rounded-md">
          You are in preview mode
        </div>
      )}
      <div className="min-h-[500px] content-center mx-auto py-5 px-4">
        {dish && (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <div className="md:py-10 mx-auto">
              <img
                className="md:h-1/2 w-full h-full rounded-lg object-contain object-center transition-opacity duration-300"
                src={dish.image.url || "/img.png"}
                alt={dish.name || "dish"}
              />
            </div>
            <div className="w-[95%] mx-auto relative md:p-10 p-4">
              <div className="md:mt-4 mt-10 px-5 pb-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl tracking-tight font-bold text-slate-900 select-text">
                    {dish.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <p className="text-yellow-500 font-semibold">
                      {dish.rating || 0}({dish.reviews.length || 0})
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-600">Category:</span>{" "}
                  {dish.category}
                </div>
                <div className="flex items-center justify-start py-2">
                  <span className="text-xl text-slate-800">${dish.price}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center font-semibold border-orange-100 pt-5">
                    <span
                      onClick={decrementQuantity}
                      className="cursor-pointer rounded-l font-bold bg-orange-100 py-1 px-3.5 duration-100 hover:bg-orange-500 hover:text-orange-50 "
                    >
                      -
                    </span>
                    <span className="text-center px-2">{quantity}</span>
                    <span
                      onClick={incrementQuantity}
                      className="cursor-pointer rounded-r font-bold bg-orange-100 py-1 px-3 duration-100 hover:bg-orange-500 hover:text-orange-50"
                    >
                      +
                    </span>
                  </div>
                  <div className="md:scale-100 scale-75">
                    <div className="flex items-center justify-center">
                      <GiHotSpices className="scale-[2] mb-4 text-orange-500" />
                    </div>
                    <div className="flex space-x-3 my-1">
                      {dish.spiciness.map((spiciness, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => handleSpicinessSelect(spiciness)}
                            className={`px-2 border-2 ${
                              selectedSpiciness === spiciness
                                ? "border-orange-600 bg-orange-600 text-white"
                                : "border-orange-400"
                            } cursor-pointer`}
                          >
                            {spiciness}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-7 gap-1 my-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div
                          key={day}
                          className={`text-center w-10 h-10 text-xs md:scale-100 scale-75 font-semibold content-center rounded-full border-2 ${
                            dish.available_days.includes(day)
                              ? "bg-orange-500 text-white border-orange-500"
                              : "text-orange-500 border-orange-500 "
                          }`}
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <button
                  className="flex items-center justify-center w-full rounded-md bg-orange-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addToCart(dish, quantity, selectedSpiciness)}
                  disabled={
                    !dish.available_days.includes(getShortDayName()) ||
                    dish.dish_availability !== "Available" ||
                    isPreviewMode
                  }
                >
                  <FaCartArrowDown />
                  <span className="pl-2 font-bold">Add To Cart</span>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center font-bold text-lg text-slate-700 py-2 select-text">
                  <Image
                    height={50}
                    width={50}
                    src={vendor.logo.url}
                    alt={`${vendor.name} profile`}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div>
                      {vendor?.isTopRated && (
                        <div
                          className="w-32 h-6 bg-pink-600 px-3 font-bold text-white text-sm flex items-center rounded-r-md"
                          style={{
                            clipPath:
                              "polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 0 0)",
                          }}
                        >
                          Top Rated
                        </div>
                      )}
                    </div>
                    <Link
                      title={process.env.NEXT_PUBLIC_NAME}
                      href={`/vendors/${vendor.documentId}`}
                    >
                      By {vendor.name}
                    </Link>
                  </div>
                </div>
                <div>
                  {dish.vegetarian ? (
                    <div className="font-bold text-sm text-slate-500">
                      Vegetarian Dish
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-slate-500">
                      Non-Vegetarian Dish
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-bold">Cooking Time:</span>{" "}
                  {dish.cooking_time} minutes
                </div>
                <div>
                  <span className="font-bold text-slate-600">Ingredients</span>{" "}
                  :{" "}
                  {dish.ingredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      className="text-sm text-slate-500 inline-block"
                    >
                      {ingredient}&nbsp;
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-4">
                <h2 className="font-bold text-center py-3">Description</h2>
                <div className="max-h-40 overflow-auto">
                  <p className="text-center text-slate-700">
                    {dish.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="p-4 w-[95%] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Feedbacks</h2>
            <div>
              {hasReviewed && (
                <p className="text-gray-600 text-sm">you already reviewed</p>
              )}
              {!hasReviewed && !isPreviewMode && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleOpenPopup}
                    className="px-4 py-2 bg-slate-50 text-orange-500 font-bold rounded-md hover:bg-slate-100 flex items-center justify-center"
                  >
                    Rate <FaStar className="inline ml-2" />
                  </button>

                  <ProductReviewPopup
                    isOpen={isReviewPopupOpen}
                    onClose={handleClosePopup}
                    productId={dish.id}
                    vendorId={slug}
                    userName={user}
                  />
                </div>
              )}
            </div>
          </div>

          {dish.reviews && dish.reviews.length > 0 && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mx-auto">
              {dish.reviews
                .sort(() => Math.random() - 0.5)
                .slice(0, 8)
                .sort((a, b) => a.text.length - b.text.length)
                .map((review, index) => {
                  return (
                    <div key={index} className="bg-slate-100 p-4">
                      <h3 className="flex items-center justify-between text-gray-700">
                        <div className="font-medium">
                          {review.user_name
                            .substring(0, 3)
                            .split(" ")
                            .map(
                              (part) =>
                                part.charAt(0).toUpperCase() +
                                part.slice(1).toLowerCase()
                            )
                            .join(" ")}
                          ******
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.date}
                        </div>
                      </h3>
                      <div className="flex items-center justify-center space-x-2">
                        {[...Array(review.rating)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-yellow-400 inline"
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-gray-600">
                        {review.text.length > 100
                          ? review.text.substr(0, 97) + "..."
                          : review.text}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
          {dish.reviews && dish.reviews.length == 0 && (
            <div className="flex items-center justify-center">
              <p className="text-gray-600">No reviews yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="py-5 w-[95%] mx-auto">
        <DeliciousDeals />
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
