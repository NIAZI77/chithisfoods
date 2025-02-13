import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VendorCard from "../components/vendorCard";
import Loading from "@/app/loading";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function TopShef({ zipcode }) {
  const [topShefs, setTopShefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);

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
      let data = await response.json();
      data = data.data.sort((a, b) => b.rating - a.rating);
      setVendors(data);
      setTopShefs(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendors();
  }, []);
  useEffect(() => {
    if (zipcode) {
      const filteredVendors = vendors.filter(
        (vendor) => vendor.location.zipcode == zipcode
      );
      setTopShefs(filteredVendors.slice(0, 10));
    } else {
      setTopShefs(vendors.slice(0, 10));
    }
  }, [zipcode]);

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute -right-10 top-[60%] transform -translate-y-1/2 text-2xl p-1 cursor-pointer text-white bg-orange-400 hover:bg-orange-600 rounded-full content-center z-10"
      onClick={onClick}
    >
      <FaAngleRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute -right-10 top-[40%] transform -translate-y-1/2 text-2xl p-1 cursor-pointer text-white bg-orange-400 hover:bg-orange-600 rounded-full content-center z-10"
      onClick={onClick}
    >
      <FaAngleLeft />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 760, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 1600, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {topShefs.length > 2 && (
        <div className="mx-auto p-2 py-5">
          <h2 className="md:text-2xl text-xl font-bold mb-8">Top Shefs</h2>
          <div className="flex justify-center items-center md:w-[95%] w-[80%] mx-auto relative">
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
