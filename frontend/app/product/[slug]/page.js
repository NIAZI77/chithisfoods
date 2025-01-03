"use client";
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
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (slug && productId) {
      fetchDish();
    }
  }, [slug, productId]);

  const fetchDish = async () => {
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
        setDish(foundDish);
        if (foundDish && foundDish.image) {
          setActive(foundDish.image.url);
        }
      } else {
        toast.error(data.error?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error("An error occurred while fetching the vendor");
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSpicinessSelect = (s) => setSelectedSpiciness(s);

  const addToCart = (item, quantity, selectedSpiciness) => {
    toast.success(`${item.name} added to cart`);
  };

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
            <div className="bg-green-200 md:w-[40%] md:mx-auto relative md:p-10 p-4">
              <div className="md:mt-4 mt-10 px-5 pb-5">
                <h1 className="text-4xl tracking-tight font-bold text-green-900 select-text">
                  {dish.name
                    .split(" ")
                    .map(
                      (part) =>
                        part.charAt(0).toUpperCase() +
                        part.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </h1>
                <div className="flex items-center justify-start py-2">
                  <p className="text-center text-green-500">
                    {dish.description}
                  </p>
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
                  <div>
                    <span className="font-bold text-slate-600">
                      {" "}
                      ingredients
                    </span>{" "}
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
                <div className="flex items-center justify-start py-2">
                  <span className="text-xl text-green-800">${dish.price}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center font-semibold border-green-100">
                    <span
                      onClick={decrementQuantity}
                      className="cursor-pointer rounded-l font-bold bg-green-100 py-1 px-3.5 duration-100 hover:bg-green-500 hover:text-green-50 "
                    >
                      -
                    </span>
                    <span className="text-center px-2">{quantity}</span>
                    <span
                      onClick={incrementQuantity}
                      className="cursor-pointer rounded-r font-bold bg-green-100 py-1 px-3 duration-100 hover:bg-green-500 hover:text-green-50"
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
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-green-400"
                          } cursor-pointer`}
                        >
                          {spiciness}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  className="flex items-center justify-center w-full rounded-md bg-green-800 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-700"
                  onClick={() => addToCart(dish, quantity, selectedSpiciness)}
                >
                  <FaCartArrowDown />
                  <span className="pl-2">Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>,
      <ToastContainer />
    </>
  );
};

export default Page;
