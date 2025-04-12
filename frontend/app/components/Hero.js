import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div>
      <div className="flex bg-gradient-to-b from-rose-100 to-green-100 justify-center items-center p-6 md:p-12 min-h-screen rounded-lg shadow-sm">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Chef Illustration"
            width={200}
            height={150}
            className="mx-auto"
          />

          <h2 className="text-lg font-semibold mt-4">
            Welcome to Chithi&apos;s Foods
          </h2>
          <p className="text-gray-600">Order your favorite dishes with ease</p>
          <Image
            src="/chef.jpg"
            alt="Chef Illustration"
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
