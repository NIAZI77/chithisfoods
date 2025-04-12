'use client';

import Image from 'next/image';
import { Star, Plus } from 'lucide-react';

export default function ProductCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-72 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            src="/person.jpeg" // Replace with actual image or use a placeholder
            alt="Seller"
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover object-center"
          />
          <p className="font-semibold text-sm">Smith’s Food</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span>4.8</span>
        </div>
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden mb-3">
        <Image
          src="/food.png" // Replace with actual image path
          alt="Sausage Pasta"
          width={268}
          height={144}
          className="w-64 h-36 aspect-video object-cover object-center bg-red-100 rounded-xl mx-auto"
        />
      </div>

      {/* Title and Serving */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold">Sausage Pasta</h3>
        <div className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-lg">
          Servings 1-2
        </div>
      </div>

      {/* Category and Distance */}
      <p className="text-sm text-gray-500">
        Cooked Food · <span className="text-green-500 font-medium">Pasta</span>
      </p>

      {/* Add to Cart Section */}
      <div className="mt-4 grid grid-cols-3 border border-red-500 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2 text-red-500 font-semibold text-xs border-r-2 border-r-rose-500 col-span-2">
          <Plus className="w-6 h-6 p-1 bg-rose-600 text-white font-bold rounded-full" />
          ADD TO CART
        </div>
        <div className="text-red-500 font-bold text-md text-right">$19.99</div>
      </div>
    </div>
  );
}
