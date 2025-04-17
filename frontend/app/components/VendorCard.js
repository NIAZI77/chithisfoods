"use client";

import Image from "next/image";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { FaStar } from "react-icons/fa";

const VendorCard = () => {
  return (
    <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden relative">
      <div className="relative h-40 w-full">
        <Image
          src="/baryani.jpeg"
          alt="Vendor Food"
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center justify-center">
          <FaStar className="inline mr-1" /> Top Rated
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white mt-5">
            <Image
              src="/person.jpeg"
              alt="Vendor Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">BBQ Bros Grill</h3>
            <p className="text-sm text-gray-500">Barbecue, American</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" stroke="none" />
          ))}
          <span className="text-gray-600 ml-1">4.8</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs mt-2">
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <BadgeCheck size={14} /> Verified
          </span>
          <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full">
            <MapPin size={14} /> New York, NY
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
