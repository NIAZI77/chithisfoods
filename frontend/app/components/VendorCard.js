"use client";

import Image from "next/image";
import { ChefHat, MapPin } from "lucide-react";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import Link from "next/link";

const VendorCard = ({ chef }) => {
  const isTopRated = chef.rating >= 1.5;
  const verified = chef?.verified || true;
  return (
    <Link
      href={`/vendors/@${chef?.username}`}
      className="block w-72 bg-white rounded-2xl shadow-md overflow-hidden relative pb-1 hover:shadow-lg transition-shadow duration-300 ease-in-out"
    >
      <div className="relative h-40 w-full">
        <Image
          src={chef?.coverImage?.url || "/fallback.png"}
          alt={chef?.coverImage?.alternativeText || "Vendor Food"}
          fill
          className="object-cover"
        />
        {isTopRated && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 rounded-md flex items-center gap-1 shadow">
            <ChefHat className="inline w-4" />
            Top Rated
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 p-1">
        <div className="">
          <div className="relative w-20 h-20 mx-auto -mt-10 mb-2">
            <Image
              src={chef?.avatar?.url || "/vendor-avatar.jpg"}
              alt={chef?.avatar?.alternativeText || "Vendor Avatar"}
              fill
              className="object-cover rounded-full border-5 border-white"
            />
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <h3 className="font-semibold text-gray-800 text-md">
            {chef?.storeName.length > 18
              ? chef?.storeName
                  .replace(/\b\w/g, (c) => c.toUpperCase())
                  .slice(0, 15) + "..."
              : chef?.storeName.replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(chef.rating) ? (
                <FaStar key={i} className="text-yellow-400" />
              ) : (
                <FaStar key={i} className="text-slate-300" />
              )
            )}
            <span className="ml-2 text-gray-700 font-semibold text-base">
              {chef.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 p-2">
        {verified && (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-1 py-0.5 rounded-full font-medium text-xs">
            <FaCheckCircle className="text-green-500" />
            Verified
          </span>
        )}
        <span className="flex  items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium text-xs">
          <MapPin size={14} />
          {chef?.city.replace(/\b\w/g, (c) => c.toUpperCase()) ||
            "Location"}, {chef?.zipcode || "address"}
        </span>
      </div>
    </Link>
  );
};

export default VendorCard;
