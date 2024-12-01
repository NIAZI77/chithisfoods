"use client"
import React from 'react';
import Banner from './components/banner'
import TopCategories from './HomeComponents/topCategories';
import TopShef from './HomeComponents/topShef';
import AmericanShefs from './HomeComponents/americanShefs';
import DeliciousDeals from './HomeComponents/DeliciousDeals';
import MediterraneanShefs from './HomeComponents/MediterraneanShefs';



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
