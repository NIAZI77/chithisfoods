"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function Banner() {
  const [banners, setBanners] = useState([
    "/banner-1.jpg",
    "/banner-2.jpg",
    "/banner-3.jpg",
  ]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="relative w-full mx-auto pb-4">
      <Slider {...settings} className="w-[95%] mx-auto">
        {banners.map((image, index) => (
          <div
            key={index}
            className="flex justify-center items-center rounded-xl overflow-hidden"
          >
            <img
              height={100}
              width={100}
              src={image}
              alt={`banner-${index}`}
              className="w-full md:h-[400px] h-[250px] object-cover object-center rounded-xl mx-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
