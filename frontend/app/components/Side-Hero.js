"use client";

import React from "react";

const Hero = () => {
  return (
    <div>
      <div className="flex bg-gradient-to-b from-rose-100 to-green-100 justify-center items-center p-6 md:p-12 min-h-screen rounded-lg shadow-sm sticky top-20 z-10">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Chef Illustration"
            className="mx-auto w-32 h-20 md:w-[200px] md:h-[150px] object-contain rounded-xl"
          />

          <h2 className="text-lg font-semibold mt-4 cursive">
            Welcome to Chithi&apos;s Foods
          </h2>
          <p className="text-gray-600">Order your favorite dishes with ease</p>
          <img
            src="/chef-ill.png"
            alt="Chef Illustration"
            className="w-40 h-40 md:w-[300px] md:h-[300px] object-contain rounded-xl mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
