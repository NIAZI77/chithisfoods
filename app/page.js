"use client"
import React from 'react';
import ImageSlider from './components/imageSlider';
import TopCategories from './components/topCategories';
import TopShef from './components/topShef';
import AmericanShefs from './components/americanShefs';
import DeliciousDeals from './components/DeliciousDeals';
import MediterraneanShefs from './components/MediterraneanShefs';



const Home = () => {
  return (
    <div className='md:w-[80%] w-[90%] mx-auto py-5 space-y-10'>
      <div>
        <ImageSlider />
      </div>
      <div>
        <TopCategories />
      </div>
      <div>
        <TopShef />
      </div>
      <div>
        <AmericanShefs />
      </div>
      <div>
        <MediterraneanShefs />
      </div>
      <div>
        <DeliciousDeals />
      </div>

    </div>

  );
};

export default Home;
