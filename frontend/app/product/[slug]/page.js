"use client";
import Loading from "@/app/loading";
import Custom404 from "@/app/not-found";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { slug } = params;
  const productId = searchParams.get("productId");

  const [dish, setDish] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiciness, setSelectedSpiciness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  useEffect(() => {
    if (slug && productId) {
      fetchDish();
    }
  }, [slug, productId]);

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

      const data = await response.json();

      if (response.ok) {
        setVendor(data.data);
        const foundDish = data.data.menu.find(
          (dishItem) => dishItem.id == productId
        );
        if (foundDish) {
          setDish(foundDish);
          setSelectedSpiciness(foundDish.spiciness[0]);
        } else {
          setProductNotFound(true);
        }
      } else {
        toast.error(data.error?.message || "An error occurred");
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

  const addToCart = (item, quantity, selectedSpiciness) => {
    if (!selectedSpiciness) {
      toast.error("Please select a spiciness level.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.productId === item.id &&
        cartItem.selectedSpiciness === selectedSpiciness
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        productId: item.id,
        vendorID: slug,
        ...item,
        quantity,
        selectedSpiciness,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${item.name} added to cart`);
  };

  const getShortDayName = () => {
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = new Date().getDay();
    return shortDayNames[dayOfWeek];
  };

  if (loading) {
    return <Loading />;
  }

  if (productNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <div className="min-h-screen content-center mx-auto py-10 px-4">
        {dish && (
          <div className="md:flex md:items-center md:justify-around">
            <div className="md:py-10 mx-auto">
              <img
                className="md:w-96 md:h-96 w-full h-full rounded-lg object-contain object-center transition-opacity duration-300"
                src={dish.image.url}
                alt="Main product"
              />
            </div>
            <div className="md:w-[40%] md:mx-auto relative md:p-10 p-4">
              <div className="md:mt-4 mt-10 px-5 pb-5">
                <h1 className="text-4xl tracking-tight font-bold text-slate-900 select-text">
                  {dish.name
                    .split(" ")
                    .map(
                      (part) =>
                        part.charAt(0).toUpperCase() +
                        part.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </h1>
                <div>
                  <span className="font-bold text-slate-600">Category:</span>{" "}
                  {dish.category}
                </div>
                <div className="flex items-center justify-start py-2">
                  <span className="text-xl text-slate-800">${dish.price}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center font-semibold border-orange-100">
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
                  disabled={!dish.available_days.includes(getShortDayName())}
                >
                  <FaCartArrowDown />
                  <span className="pl-2 font-bold">Add To Cart</span>
                </button>
              </div>

              <div>
                <div>
                  <div className="flex items-center font-bold text-lg text-slate-700 py-2">
                    <img
                      height={50}
                      width={50}
                      src={vendor.logo.url}
                      alt={`${vendor.name} profile`}
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    By Shef's {vendor.name}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-600">ingredients</span>{" "}
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
                <div>Cooking TIme : {dish.cooking_time} minutes</div>
              </div>
              <div className="flex items-center justify-start py-2">
                <h2>Description</h2>
                <p className="text-center text-slate-700">{dish.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
