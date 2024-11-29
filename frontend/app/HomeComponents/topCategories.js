"use client";
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import Image from 'next/image';

export default function TopCategories() {
  const [topCategories, setTopCategories] = useState([
    {
      name: 'Cooked Food',
      imageUrl: 'https://images.pexels.com/photos/20350178/pexels-photo-20350178/free-photo-of-food-on-plate.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/cooked-food'
    },
    {
      name: 'Fruit',
      imageUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/fruit'
    },
    {
      name: 'Vegetable',
      imageUrl: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/vegetable'
    },
    {
      name: 'Fish',
      imageUrl: 'https://images.pexels.com/photos/25440737/pexels-photo-25440737/free-photo-of-baked-bass-on-black-plate.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/fish'
    },
    {
      name: 'Spice',
      imageUrl: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/spice'
    },
    {
      name: 'Butter',
      imageUrl: 'https://images.pexels.com/photos/94443/pexels-photo-94443.jpeg?auto=compress&cs=tinysrgb&w=600',
      linkUrl: '/category/butter'
    },
  ]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1170,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-3xl font-bold mb-4">Top Categories</h2>
      <div className="flex flex-wrap justify-evenly items-center">
        <Slider {...settings} className='w-[95%] mx-auto'>
          {topCategories.map((category, index) => (
            <Link key={index} href={category.linkUrl} className="mx-4 my-4 flex justify-center items-center flex-col p-5">
              <Image height={100} width={100}
                src={category.imageUrl}
                alt={category.name}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
              <div className="text-center mt-2 font-bold text-lg">{category.name}</div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}