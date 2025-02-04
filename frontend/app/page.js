"use client";

import React from "react";
import Banner from "@/app/components/banner";
import TopCategories from "./HomeComponents/topCategories";
import TopShef from "./HomeComponents/topShef";
import DeliciousDeals from "./HomeComponents/deliciousDeals";
import StateShefs from "./HomeComponents/StateShefs";

const Home = () => {
  return (
    <div className="md:w-[80%] w-[90%] mx-auto py-5 space-y-10">
      <div>
        <Banner />
      </div>
      <div>
        <TopCategories />
      </div>
      <div>
        <DeliciousDeals />
      </div>
      <div>
        <TopShef />
      </div>
      <div>
        <StateShefs />
      </div>
    </div>
  );
};

export default Home;
