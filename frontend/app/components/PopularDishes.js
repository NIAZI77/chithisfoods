"use client";
import ProductCard from "./ProductCard";

export default function PopularDishes() {
  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Popular Dishes</h2>
      <div className="flex items-center justify-center flex-wrap gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCard key={i} className="mx-auto" />
        ))}
      </div>
    </div>
  );
}
