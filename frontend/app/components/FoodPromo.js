"use client";

import Image from "next/image";

const FoodPromo = () => {
  return (
    <section className="bg-green-50 rounded-2xl p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto shadow-lg mt-10 items-center">
      <div className="order-1 md:order-2 relative w-64 h-64 md:w-80 md:h-80 mx-auto lg:col-span-1">
        <div className="w-full h-full bg-black rounded-full overflow-hidden">
          <Image
            src="/food.png"
            alt="Delicious food"
            width={320}
            height={320}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      <div className="order-2 md:order-1 text-center md:text-left lg:col-span-2 md:px-4">
        <h2 className="lg:text-4xl md:text-2xl text-xl font-extrabold text-gray-900 cursive">
          A Guilt-Free Shortcut to <br />
          <span className="text-green-500">Delicious Dinners</span>
        </h2>
        <p className="text-gray-600 mt-4">
          With the Weekly Shef Service, your chef prepares fresh meals for you
          and a small group, packed with care and delivered straight to your
          door.
        </p>
        <button className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
          Order Now
        </button>
      </div>
    </section>
  );
};

export default FoodPromo;
