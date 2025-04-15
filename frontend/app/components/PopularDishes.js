"use client";
import ProductCard from "./ProductCard";

export default function PopularDishes() {
  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">
        Popular Dishes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
    </div>
  );
}
