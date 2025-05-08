"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProductCard from "./DishCard";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function PopularDishes({ zipcode }) {
  const router = useRouter();
  const [popularDishes, setPopularDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!zipcode) {
      router.push("/");
      setIsLoading(false);
      return;
    }
  }, [router]);
  useEffect(() => {
    if (!zipcode) return;
    fetchPopularDishesByZipcode(zipcode);
  }, [zipcode]);

  const fetchPopularDishesByZipcode = async (zipcode) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[zipcode][$eq]=${zipcode}&populate=*&sort=rating:desc&pagination[pageSize]=6`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const result = await response.json();

      if (
        response.ok &&
        Array.isArray(result?.data) &&
        result.data.length > 0
      ) {
        setPopularDishes(result.data);
      } else {
        toast.info("No popular dishes found in your area.");
      }
    } catch (error) {
      toast.error("Unable to load dishes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Popular Dishes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {popularDishes.map((dish) => (
          <ProductCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
