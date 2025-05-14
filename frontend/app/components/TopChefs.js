"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import VendorCard from "./VendorCard";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function TopChefs({ zipcode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [topVendors, setTopVendors] = useState([]);

  useEffect(() => {
    if (!zipcode) {
      router.push("/");
      setIsLoading(false);
      return;
    }
    fetchTopVendorsByZipcode(zipcode);
  }, [zipcode, router]);

  const fetchTopVendorsByZipcode = async (zipcode) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[zipcode][$eq]=${zipcode}&populate=*&sort=rating:desc&pagination[pageSize]=6`,
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
        setTopVendors(result.data || []);
      } else {
        toast.error("Failed to load top chefs. Please try again later.");
        setTopVendors([]);
      }
    } catch (error) {
      console.error("Error fetching top chefs:", error);
      toast.error("Failed to load top chefs. Please try again later.");
      setTopVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {topVendors.length > 0 && (
        <div className="md:w-[80%] w-full mx-auto p-2">
          <h2 className="md:text-2xl text-xl font-bold mb-4">
            Top Rated Chefs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {topVendors.map((vendor) => (
              <VendorCard key={vendor.id} chef={vendor} className="mx-auto" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
