"use client";
import VendorCard from "./VendorCard";

export default function TopChefs() {
  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Top Rated Chefs</h2>
      <div className="flex items-center justify-center flex-wrap gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <VendorCard key={i} className="mx-auto" />
        ))}
      </div>
    </div>
  );
}
