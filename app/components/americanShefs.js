import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VendorCard from './vendorCard';

export default function AmericanShefs() {
  const [AmericanShefs, setAmericanShefs] = useState([]);

  const vendors = [
    {
      name: 'Ritu',
      image: 'https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg',
      location: 'North Indian',
      rating: 4,
      Vegetarian: true,
      topRated: false,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },
    {
      name: 'Ritu',
      image: 'https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg',
      location: 'North America',
      rating: 4,
      Vegetarian: true,
      topRated: true,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },
    {
      name: 'Ritu',
      image: 'https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg',
      location: 'American Indian',
      rating: 4,
      Vegetarian: true,
      topRated: true,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },
    {
      name: 'Ritu',
      image: 'https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg',
      location: 'North American Indian',
      rating: 4,
      Vegetarian: true,
      topRated: true,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },
  ];

  useEffect(() => {
    // Correct filtering based on 'location' and fix toLowerCase() typo
    const filteredVendors = vendors.filter(vendor => vendor.location.toLowerCase().includes("usa") || vendor.location.toLowerCase().includes("america"));
    setAmericanShefs(filteredVendors);
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

  return (
    <div className="mx-auto p-2">
      <h2 className="text-3xl font-bold mb-4">American Shefs</h2>
      <div className="flex justify-center items-center">
        <Slider {...settings} className="w-full mx-auto flex items-center justify-center">
          {AmericanShefs.length > 0 ? (
            AmericanShefs.map((shef, index) => (
              <div key={index} className="!flex justify-center items-center">
                <VendorCard vendor={shef} className="mx-auto" />
              </div>
            ))
          ) : (
            <p>No American chefs available.</p>
          )}
        </Slider>
      </div>
    </div>
  );
}