"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";

export default function TopCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?populate=*&sort=createdAt:asc`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Top Categories</h2>
      <div className="flex justify-evenly items-center flex-wrap gap-5">
        {categories.map((category) => (
          <Link
            href={`/category/${category.name}`}
            key={category.id}
            className="flex flex-col items-center justify-center text-center
            w-28 h-28 bg-pink-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <Image
              src={category.image?.url || '/fallback.png'}
              alt={category.name}
              width={56}
              height={56}
              className="mx-auto object-cover"
            />
            <p className="mt-1.5 text-[11px] capitalize">{category.name.replace(/-/g, ' ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
