"use client";

import React from 'react';
import Banner from '@/app/components/banner';
import TopCategories from '@/app/HomeComponents/TopCategories';
import DeliciousDeals from '@/app/HomeComponents/DeliciousDeals';
import TopShef from '@/app/HomeComponents/TopShef';
import StateShefs from '@/app/HomeComponents/StateShefs';

const Home = () => {
  return (
    <div className='md:w-[80%] w-[90%] mx-auto py-5 space-y-10'>
      <div>
        <Banner />
      </div>
      <div>
        <TopCategories />
      </div>
      <div>
        <TopShef />
      </div>
      <div>
        <DeliciousDeals />
      </div>
      <div>
        <StateShefs />
      </div>
    </div>
  );
};

export default Home;
