"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/app/HomeComponents/banner";
import TopCategories from "./HomeComponents/topCategories";
import TopShef from "./HomeComponents/topShef";
import DeliciousDeals from "./HomeComponents/deliciousDeals";
import StateShefs from "./HomeComponents/StateShefs";
import ShefNearMeSwitchToggle from "./components/ShefNearMeSwitchToggle";

const Home = () => {
  const [isOn, setIsOn] = useState(false);
  const [zipcode, setZipcode] = useState("");
  return (
    <div className="md:w-[80%] w-[90%] mx-auto py-5">
      <div>
        <Banner />
      </div>
      <div>
        <TopCategories />
      </div>
      {/* <div className="flex items-center justify-end"> */}
      <div className="inline-flex float-end items-center justify-end mt-5">
        <div className="">
          <ShefNearMeSwitchToggle setZipcode={setZipcode} setIsOn={setIsOn} />
        </div>
      </div>
      {/* </div> */}
      <div>
        <TopShef zipcode={zipcode} />
      </div>
      <div>
        <DeliciousDeals zipcode={zipcode} />
      </div>
      <div>
        <StateShefs zipcode={zipcode} />
      </div>
    </div>
  );
};

export default Home;
