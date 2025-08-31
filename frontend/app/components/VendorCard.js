"use client";

import { ChefHat, MapPin } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import VerificationBadge from "./VerificationBadge";

const VendorCard = ({ chef }) => {
  const isTopRated = chef.rating >= 3.5;
  return (
    <Link
      href={`/vendors/@${chef?.username}`}
      className="block w-72 bg-white rounded-2xl shadow-md overflow-hidden relative pb-1 hover:shadow-lg transition-shadow duration-300 ease-in-out"
    >
      <div className="relative h-40 w-full">
        <img
          src={chef?.coverImage?.url || "/fallback.png"}
          alt={chef?.coverImage?.alternativeText || "Vendor Food"}
          className="object-cover w-full h-full"
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
            <img
              src={chef?.avatar?.url || "/vendor-avatar.jpg"}
              alt={chef?.avatar?.alternativeText || "Vendor Avatar"}
              className="object-cover rounded-full border-5 border-white w-20 h-20"
            />
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <h3 className="font-semibold text-gray-800 text-md truncate capitalize">
            {chef?.storeName}
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
      <div className="flex items-center justify-end gap-2 p-2 text-gray-600 text-xs">
        <VerificationBadge status={chef.verificationStatus} size="small" />
        <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
          <MapPin size={14} />
          {chef?.city && chef.city.length < 10
            ? chef.city
            : chef?.city
            ? chef.city.substr(0, 6) + "..."
            : "Location"}
          , {chef?.zipcode || "address"}
        </span>
      </div>
    </Link>
  );
};

export default VendorCard;
