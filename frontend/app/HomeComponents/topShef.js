import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VendorCard from "../components/vendorCard";
import Loading from "@/app/loading";

export default function TopShef() {
  const [topShefs, setTopShefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[isTopRated][$eq]=true&populate=*`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setTopShefs(data.data.sort((a, b) => b.rating - a.rating).slice(0, 10));
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
      {
        breakpoint: 699,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {topShefs.length > 2 && (
        <div className="mx-auto p-2">
          <h2 className="text-3xl font-bold mb-4">Top Shefs</h2>
          <div className="flex justify-center items-center">
            <Slider
              {...settings}
              className="w-full mx-auto flex items-center justify-center"
            >
              {topShefs.map((shef, index) => (
                <div key={index} className="!flex justify-center items-center">
                  <VendorCard vendor={shef} className="mx-auto" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
}
