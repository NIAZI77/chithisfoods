import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VendorCard from "../components/vendorCard";
import Loading from "@/app/loading";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function StateShefs({ zipcode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateVendor, setStateVendor] = useState([]);

  const fetchVendors = async () => {
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
      let data = await response.json();
      data = data.data;
      setData(data);
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
    if (data.length > 0 && !zipcode && zipcode.length < 5) {
      const groupedVendors = groupVendorsByState(data);
      setStateVendor(groupedVendors);
    } else {
      setStateVendor([]);
    }
  }, [data, zipcode]);
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

  function groupVendorsByState(vendors) {
    const grouped = vendors.reduce((acc, vendor) => {
      const state = vendor.location.state.toLowerCase();
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(vendor);
      return acc;
    }, {});

    return Object.entries(grouped).map(([state, vendorData]) => ({
      state,
      vendorData,
    }));
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {stateVendor.map((group, index) => (
        <div key={index}>
          {group.vendorData.length > 2 && (
            <div className="mx-auto p-2 py-5">
              <h2 className="md:text-2xl text-xl font-bold mb-8">
                {group.state
                  .split(" ")
                  .map(
                    (part) =>
                      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </h2>
              <div className="flex justify-center items-center">
                <Slider
                  {...settings}
                  className="flex items-center justify-center md:w-[95%] w-[80%] mx-auto relative"
                >
                  {group.vendorData
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 10)
                    .map((chef, index) => (
                      <div
                        key={index}
                        className="!flex justify-center items-center"
                      >
                        <VendorCard vendor={chef} className="mx-auto" />
                      </div>
                    ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
