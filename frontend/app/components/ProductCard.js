"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { FaUser } from "react-icons/fa";

export default function ProductCard() {
  const product = {
    name: "Spicy Chicken Biryani",
    image: "/baryani.jpeg",
    price: 9.99,
    rating: 4.5,
    servings: 2,
    category: "Main Course",
    subcategory: "Rice Dishes",
    chef: {
      name: "Ali Raza",
      avatar: "/person.jpeg",
      rating: 4.9,
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            src={product.chef.avatar}
            alt={product.chef.name}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover object-center"
          />
          <p className="font-semibold text-sm">{product.chef.name}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden mb-3">
        <Image
          src={product.image}
          alt={product.name}
          width={268}
          height={144}
          className="w-64 h-36 aspect-video object-cover object-center rounded-xl mx-auto"
        />
      </div>

      {/* Title and Serving */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-sm flex items-center gap-1 justify-center">
          Servings <FaUser /> {product.servings}
        </div>
      </div>

      {/* Category and Subcategory */}
      <p className="text-sm text-gray-500">
        {product.category} ·{" "}
        <span className="text-green-500 font-medium">
          {product.subcategory}
        </span>
      </p>

      {/* Add to Cart Section */}
      <div className="mt-4 grid grid-cols-3 border border-red-500 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2 text-red-500 font-semibold text-xs border-r-2 border-r-rose-500 col-span-2">
          <Plus className="w-6 h-6 p-1 bg-rose-600 text-white font-bold rounded-full" />
          ADD TO CART
        </div>
        <div className="text-red-500 font-bold text-md text-right">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
