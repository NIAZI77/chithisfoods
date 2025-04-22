"use client";

import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import Testimonials from "../components/Testimonial";
import TopCategories from "../components/TopCategories";
import FoodPromo from "../components/FoodPromo";
import TopChefs from "../components/TopChefs";
import PopularDishes from "../components/PopularDishes";
import { useRouter } from "next/navigation";
export default function Explore() {
  const router = useRouter();
  const handleChangeLocation = () => {
    router.push("/");
    // localStorage.removeItem("zipcode");
  };
  return (
    <div className="space-y-10">
      <section className="bg-slate-800 h-screen max-h-[700px] flex items-center px-4 -mt-20">
        <div className="w-full md:w-[90%] mx-auto grid lg:grid-cols-2 grid-cols-1 items-center">
          <div className="space-y-5 order-2 text-center lg:text-left lg:order-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white cursive">
              Tasty food in your <br />
              <span className="text-green-400">Neighborhood</span>
            </h1>
            <p className="text-lg text-gray-300">
              Order food from favorite chefs near you.
            </p>
            <div className="flex space-x-4 justify-center lg:justify-start">
              <div className="flex items-center justify-center lg:justify-start gap-4 text-green-400 font-bold md:text-5xl text-xl">
                <FiMapPin />
                30340
              </div>
              <div className="flex items-center justify-center py-4">
                <button
                  onClick={handleChangeLocation}
                  className="bg-green-400 text-white md:px-4 px-2 md:py-3 py-1.5 rounded-full shadow-md hover:bg-green-500 transition-all font-semibold"
                >
                  Change Location
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-80 h-80">
              <Image
                src="/food.png"
                width={400}
                height={400}
                className="object-contain"
                alt="Delicious food"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <TopCategories />
      </section>
      <section>
        <TopChefs />
      </section>
      <section>
        <PopularDishes />
      </section>
      <section>
        <Testimonials />
      </section>

      <section>
        <FoodPromo />
      </section>
    </div>
  );
}
