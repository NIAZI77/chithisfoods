"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import DishCard from "./DishCard";

function seededShuffle(array, seed) {
  const result = [...array];
  const random = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function DiscoverSomethingNew({ zipcode }) {
  const router = useRouter();
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!zipcode) {
      router.push("/");
      setIsLoading(false);
      return;
    }
    fetchDishes(zipcode);
  }, [zipcode, router]);

  const fetchDishes = async (zipcode) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[zipcode][$eq]=${zipcode}&filters[available][$eq]=true&populate=*&pagination[pageSize]=50`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        const seed = getDailySeed();
        const shuffled = seededShuffle(result.data || [], seed);
        setDishes(shuffled.slice(0, 6));
      } else {
        toast.error("Unable to load dishes. Please try again later.");
        setDishes([]);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast.error("Unable to load dishes. Please try again later.");
      setDishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {dishes.length > 0 && (
        <div className="md:w-[80%] w-full mx-auto p-2">
          <h2 className="md:text-2xl text-xl font-bold mb-4">
            Discover Something New
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
