"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import VendorCard from "./VendorCard";
import Loading from "../loading";

export default function TopChefs() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    getTopChefs();
  }, []);

  const getTopChefs = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data?.data?.length > 0) {
        setChefs(data.data);
      } else {
        toast.error("We couldn't verify your vendor.");
        router.push("/become-a-vendor");
      }
    } catch (err) {
      toast.error("We couldn't verify your vendor. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Top Rated Chefs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {chefs.map((chef) => (
          <VendorCard key={chef.id} chef={chef} className="mx-auto" />
        ))}
      </div>
    </div>
  );
}
