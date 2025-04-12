import React from "react";
import FoodPromo from "./components/FoodPromo";
import Testimonials from "./components/Testimonial";
import { FaBitbucket } from "react-icons/fa";

const page = () => {
  return (
    <div>
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h4 className="text-rose-500 font-semibold tracking-wide uppercase">
            What We Serve
          </h4>
          <h2 className="text-3xl md:text-4xl text-center font-extrabold mt-2">
            Your Favourite Food <br />
            Delivery Partner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 w-[90%] mx-auto">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <FaBitbucket className="w-16 h-16 text-gray-800" />
              <h3 className="text-xl text-rose-600 font-semibold">
                Savor Freshly Made Homemade Meals
              </h3>
              <p className="text-gray-600">
                Local chefs cook for select households, offering personal-chef
                quality at a fraction of the price.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <FaBitbucket className="w-16 h-16 text-gray-800" />
              <h3 className="text-xl text-rose-600 font-semibold">
                Shef: A Sharose Personal Chef
              </h3>
              <p className="text-gray-600">
                Local chefs bring personal-chef quality to select households at
                a fraction of the price.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <FaBitbucket className="w-16 h-16 text-gray-800" />
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
