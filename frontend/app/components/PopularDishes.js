"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import DishCard from "./DishCard";
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
    fetchPopularDishesByZipcode(zipcode);
  }, [zipcode, router]);

  const fetchPopularDishesByZipcode = async (zipcode) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[serviceArea][$containsi]=${zipcode}&filters[available][$eq]=true&populate=*&sort[0]=weeklySalesCount:desc&pagination[pageSize]=6`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setPopularDishes(result.data || []);
      } else {
        toast.error(
          "We're having trouble loading dishes right now. Please try again later."
        );
        setPopularDishes([]);
      }
    } catch (error) {
      console.error("Error fetching popular dishes:", error);
      toast.error(
        "We're having trouble loading dishes right now. Please try again later."
      );
      setPopularDishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {popularDishes.length != 0 && (
        <div className="md:w-[80%] w-full mx-auto p-2">
          <h2 className="md:text-2xl text-xl font-bold mb-4">Popular Dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {popularDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
