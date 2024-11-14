import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VendorCard from '../components/vendorCard';

export default function TopShef() {
  const [topShef, setTopShef] = useState([]);

  const vendors = [
    {
      name: 'Ritu',
      image: 'https://cdn.t.shef.com/unsafe/150x0/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/961e784b-58d4-4820-9f17-785d4ab1790d.jpg',
      location: 'North Indian',
      rating: 4,
      Vegetarian: false,
      topRated: false,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },
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
      location: 'North Indian',
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
      location: 'North Indian',
      rating: 4,
      Vegetarian: true,
      topRated: true,
      product: {
        image: 'https://cdn.t.shef.com/unsafe/250x169/center/middle/https://shef-general.s3.us-west-1.amazonaws.com/uploads/79db1c0d-e6a8-4240-9239-db84aa722547_2044ef31-60ad-409f-b690-019914eaa9b3.jpeg',
      },
    },

  ];

  useEffect(() => {
    const filteredVendors = vendors.filter(vendor => vendor.topRated);
    setTopShef(filteredVendors);
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
      <h2 className="text-3xl font-bold mb-4">Delicious Deals</h2>
      <div className="flex justify-center items-center">
        <Slider {...settings} className="w-full mx-auto flex items-center justify-center">
          {topShef.length > 0 ? (
            topShef.map((shef, index) => (
              <div key={index} className="!flex justify-center items-center">
                <VendorCard vendor={shef} className="mx-auto" />
              </div>
            ))
          ) : (
            <p>No top-rated chefs available.</p>
          )}
        </Slider>
      </div>
    </div>
  );
}
