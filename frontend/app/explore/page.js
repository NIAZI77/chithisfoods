"use client";

import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import Testimonials from "../components/Testimonial";
import TopCategories from "../components/TopCategories";
import FoodPromo from "../components/FoodPromo";
import TopChefs from "../components/TopChefs";
import PopularDishes from "../components/PopularDishes";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Loading from "../loading";
import ZipcodeDialogue from "../components/zipcodeDialogue";

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [zipcode, setZipcode] = useState("");
  const router = useRouter();

  const handleZipcodeChange = useCallback((e) => {
    setZipcode(e.detail.zipcode);
  }, []);

  useEffect(() => {
    const savedZipcode = localStorage.getItem("zipcode");
    if (!savedZipcode) {
      router.push("/");
      return;
    }
    setZipcode(savedZipcode);
    setLoading(false);
    window.addEventListener("zipcodeChange", handleZipcodeChange);
    return () => {
      window.removeEventListener("zipcodeChange", handleZipcodeChange);
    };
  }, [router, handleZipcodeChange]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-10">
      <section
        className="h-screen lg:max-h-[700px] max-h-[800px] flex items-center px-4 -mt-20 object-cover bg-cover bg-no-repeat bg-bottom"
        style={{ backgroundImage: "url('/landing-page-bg.png')" }}
      >
        <div className="w-full md:w-[90%] mx-auto grid lg:grid-cols-2 grid-cols-1 items-center">
          <div className="lg:space-y-5 order-2 text-center lg:text-left lg:order-1">
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
                <span>{zipcode}</span>
              </div>
              <div className="flex items-center justify-center py-4">
                <ZipcodeDialogue />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="w-full h-full flex justify-center items-center">
              <Image
                src="/landing-page-hero.png"
                width={400}
                height={400}
                className="object-contain md:scale-125 xl:scale-150 2xl:scale-200"
                alt="Landing page hero"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <TopCategories />
      <TopChefs zipcode={zipcode} />
      <PopularDishes zipcode={zipcode} />
      <Testimonials />
      <FoodPromo />
    </div>
  );
}
