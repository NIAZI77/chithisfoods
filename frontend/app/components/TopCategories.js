"use client";
import Link from "next/link";
import Image from "next/image";

export default function TopCategories() {
  const topCategories = [
    {
      name: "Cooked Foods",
      imageUrl: "/cooked-foods.png",
      linkUrl: "/category/cooked-foods",
    },
    {
      name: "Groceries",
      imageUrl: "/Groceries.png",
      linkUrl: "/category/groceries",
    },
    {
      name: "Spices",
      imageUrl: "/Spices.png",
      linkUrl: "/category/spices",
    },
    {
      name: "Batter",
      imageUrl: "/Batter.png",
      linkUrl: "/category/batter",
    },
    {
      name: "Fish",
      imageUrl: "/Fish.png",
      linkUrl: "/category/fish",
    },
    {
      name: "Meat",
      imageUrl: "/Meat.png",
      linkUrl: "/category/meat",
    },
    {
      name: "Snacks",
      imageUrl: "/Snacks.png",
      linkUrl: "/category/snacks",
    },
  ];

  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Top Categories</h2>
      <div className="flex justify-evenly items-center flex-wrap gap-5">
        {topCategories.map((category, index) => (
          <Link
            href={category.linkUrl}
            key={index}
            className="flex flex-col items-center justify-center text-center
            w-28 h-28 bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <Image
              src={category.imageUrl}
              alt={category.name}
              width={56}
              height={56}
              className="mx-auto object-cover"
            />
            <p className="mt-1.5 text-[11px]">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
