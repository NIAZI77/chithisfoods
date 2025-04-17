import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaRegStar, FaStar } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import ProductCard from "../components/ProductCard";

const Page = () => {
  return (
    <div className="w-[80%] mx-auto">
      <section className="relative">
        <Image
          src="/baryani.jpeg"
          alt="cover Image"
          className="w-full aspect-video h-auto object-cover rounded-lg"
          width={100}
          height={100}
        />
        <Image
          src="/person.jpeg"
          alt="Profile"
          className="md:w-48 md:h-48 w-24 h-24 rounded-full object-cover relative md:bottom-16 bottom-8 left-5 border-white border-8"
          width={100}
          height={100}
        />
        <div className="lg:mb-0 -mt-8 lg:absolute lg:bottom-0 lg:right-0 lg:p-5 lg:w-[75%] xl:w-[80%]">
          <h2 className="text-lg font-semibold text-gray-800">
            Vendor Name here
          </h2>
          <p className="text-sm text-gray-500">Category 1, Category 2,</p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            As a creative agency we work with you to develop solutions to
            address your brand needs. That includes various aspects of brand
            planning and strategy, marketing and design.
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-yellow-500 text-sm">
              {Array.from({ length: 4 }).map((_, i) => (
                <FaStar key={i} />
              ))}
              <FaRegStar />
              <span className="text-gray-800 font-semibold ml-1">4.8</span>
            </div>
            <div className="flex items-center bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium gap-1">
              <FaMapMarkerAlt size={14} />
              New York, address
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="relative my-8 flex items-center justify-center overflow-hidden">
          <Separator />
          <div className="px-2 text-center bg-background text-sm">MENU</div>
          <Separator />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
