import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "@/app/loading";
import ProductCard from "../components/productCard";

export default function DeliciousDeals({ zipcode }) {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [dishData, setDishData] = useState([]);

  function getAvailableDishesToday(dishes) {
    const today = new Date().toLocaleString("en-US", { weekday: "short" });

    return dishes.filter(
      (dish) =>
        dish.available_days.includes(today) &&
        dish.dish_availability === "Available"
    );
  }

  const fetchAllDishes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();

      let dishes = data.data.flatMap((vendor) =>
        vendor.menu.map((dish) => ({
          ...dish,
          vendor,
        }))
      );
      dishes = getAvailableDishesToday(
        dishes.sort((a, b) => b.rating - a.rating)
      );
      setDishData(dishes);
      setDishes(dishes.slice(0, 10));
      return dishes;
    } catch (error) {
      console.error("Error fetching dishes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDishes();
  }, []);

  useEffect(() => {
    if (zipcode) {
      const filteredDishes = dishData.filter(
        (dish) => dish.vendor.location.zipcode == zipcode
      );
      setDishes(filteredDishes.slice(0, 10));
    }
  }, [zipcode]);

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-3xl text-gray-700 cursor-pointer hover:text-gray-900"
      onClick={onClick}
    >
      <FaAngleRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 text-3xl text-gray-700 cursor-pointer hover:text-gray-900"
      onClick={onClick}
    >
      <FaAngleLeft />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 699, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  if (loading) return <Loading />;

  return (
    <>
      {dishes.length > 2 && (
        <div className="mx-auto p-2 py-5">
          <h2 className="md:text-3xl text-2xl font-bold mb-8">Delicious Deals</h2>
          <div className="flex justify-center items-center md:w-full w-[90%] mx-auto relative">
            <Slider {...settings} className="w-full mx-auto">
              {dishes.map((dish, index) => {
                return (
                  <ProductCard
                    key={index}
                    product={dish}
                    logo={dish.vendor.logo}
                    location={dish.vendor.location}
                    documentId={dish.vendor.documentId}
                  />
                );
              })}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
}
