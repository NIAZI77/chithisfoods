import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "@/app/loading";
import ProductCard from "../components/productCard";

export default function DeliciousDeals() {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);

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
      dishes = dishes.sort((a, b) => b.rating - a.rating).slice(0, 10);
      setDishes(dishes);
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 3000,
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
        <div className="mx-auto p-2 py-6">
          <h2 className="text-3xl font-bold mb-4">Delicious Deals</h2>
          <div className="flex justify-center items-center">
            <Slider
              {...settings}
              className="w-full mx-auto flex items-center justify-center"
            >
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
