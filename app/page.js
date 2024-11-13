"use client"
import React from 'react';
import ImageSlider from './components/imageSlider';
import TopCategories from './components/topCategories';
import TopShef from './components/topShef';



const Home = () => {
  return (
    <div className='md:w-[80%] w-[90%] mx-auto py-5'>
      <div>
        <ImageSlider />
      </div>
      <div>
        <TopCategories />
      </div>
      <div>
        <TopShef />
      </div>

    </div>

  );
};

export default Home;
