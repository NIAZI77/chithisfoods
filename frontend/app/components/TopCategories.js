"use client";
import Link from "next/link";
import Image from "next/image";

export default function TopCategories() {
  const topCategories = [
    {
      name: "Cooked Food",
      imageUrl: "/a.png",
      linkUrl: "/category/cooked-food",
    },
    {
      name: "Fruit",
      imageUrl: "/a.png",
      linkUrl: "/category/fruit",
    },
    {
      name: "Vegetable",
      imageUrl: "/a.png",
      linkUrl: "/category/vegetable",
    },
    {
      name: "Fish",
      imageUrl: "/a.png",
      linkUrl: "/category/fish",
    },
    {
      name: "Spice",
      imageUrl: "/a.png",
      linkUrl: "/category/spice",
    },
    {
      name: "Butter",
      imageUrl: "/a.png",
      linkUrl: "/category/butter",
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
            w-32 h-32 bg-gray-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <Image
              src={category.imageUrl}
              alt={category.name}
              width={64}
              height={64}
              className=" mx-auto object-cover"
            />
            <p className="mt-2 text-xs">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
