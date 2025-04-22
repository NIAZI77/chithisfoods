import React from "react";
import FoodPromo from "./components/FoodPromo";
import Testimonials from "./components/Testimonial";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <section className="relative h-screen max-h-[700px] -mt-20 flex items-center justify-center text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            height={100}
            width={100}
            src="/hero-bg.jpg"
            alt="Chef preparing food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold cursive">
            Claim Best Offer
            <br /> on
            <span className="font-semibold text-rose-500"> Food & Chef</span>
          </h1>
          <div className="bg-pink-950 text-rose-100 rounded-lg p-5 mx-auto mt-8 md:w-96 w-80">
            <p className="mt-6 text-base md:text-lg leading-relaxed">
              Delicious meals by expert chefs delivered fast and free to your
              doorstep.
            </p>
            <Link
              href="/explore"
              className="uppercase w-full mt-8 px-8 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all block"
            >
              Explore Chef Services
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="text-center">
          <h4 className="text-rose-500 font-semibold tracking-wide uppercase">
            What We Serve
          </h4>
          <h2 className="text-3xl md:text-4xl text-center font-extrabold mt-2">
            Your Favourite Food <br />
            Delivery Partner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 w-[95%] mx-auto">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                height={100}
                width={100}
                src="/pizza maker.svg"
                alt="Chef preparing food"
                className="w-[60%] h-auto rounded-full mb-4"
                priority={true}
              />
              <h3 className="text-xl text-rose-600 font-semibold">
                Savor Freshly Made Homemade Meals
              </h3>
              <p className="text-gray-600">
                Local chefs cook for select households, offering personal-chef
                quality at a fraction of the price.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                height={100}
                width={100}
                src="/pizza maker.svg"
                alt="Chef preparing food"
                className="w-[60%] h-auto rounded-full mb-4"
                priority={true}
              />
              <h3 className="text-xl text-rose-600 font-semibold">
                Shef: A Sharose Personal Chef
              </h3>
              <p className="text-gray-600">
                Local chefs bring personal-chef quality to select households at
                a fraction of the price.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                height={100}
                width={100}
                src="/pizza maker.svg"
                alt="Chef preparing food"
                className="w-[60%] h-auto rounded-full mb-4"
                priority={true}
              />
              <h3 className="text-xl text-rose-600 font-semibold">
                Choose From Flexible Delivery Options
              </h3>
              <p className="text-gray-600">
                Get curated meals from $54/week or make a one-time order with
                any chef.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Testimonials />
      </section>
      <section>
        <FoodPromo />
      </section>
    </div>
  );
};

export default page;
