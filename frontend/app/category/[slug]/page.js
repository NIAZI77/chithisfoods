'use client';

import ProductCard from '@/app/components/DishCard';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const subcategories = [
  'Sets',
  'Sandwiches',
  'Sides',
  'Caesar Salads',
  'Chopped Salads',
  'Sweets',
  'Sauces',
  'Sips',
];

const Page = () => {
  const { slug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile menu toggle button */}
      <button
        className="md:hidden p-4 text-red-600 flex items-center gap-2"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
        Menu
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 duration-300 transition-all fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 p-6 flex flex-col gap-6 pt-16 md:pt-0`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div>
          <p className="font-semibold text-red-600 mb-4">Sub Categories</p>
          <ul className="space-y-2 text-sm text-gray-700">
            {subcategories.map((item) => (
              <li
                key={item}
                className={`cursor-pointer hover:text-red-600 ${
                  item.toLowerCase() === slug ? 'text-red-600 font-bold' : ''
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold mb-2 text-gray-800">Filters</p>
          <div className="space-y-2 text-sm text-gray-700">
            <label>
              <input type="checkbox" className="mr-2" />
              Vegetarian
            </label>
            <label>
              <input type="checkbox" className="mr-2" />
              Vegan
            </label>
            <label>
              <input type="checkbox" className="mr-2" />
              Gluten Free
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-4 md:pt-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {slug}
          </h1>
        </div>

        <div className="gap-6 flex items-center justify-between flex-wrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCard key={i} className="mx-auto" />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;
