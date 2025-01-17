"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import ProductCard from "@/app/components/productCard";
import Custom404 from "@/app/not-found";

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?populate=*`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    if (slug) {
      const filteredDishes = data.flatMap((vendor) =>
        vendor.menu
          .filter((dish) =>
            dish.category
              .toLowerCase()
              .includes(slug.replace("-", " ").toLowerCase())
          )
          .map((dish) => ({
            ...dish,
            vendor,
          }))
      );
      setDishes(filteredDishes);
    }
  }, [slug, data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-[90%]">
      {dishes.length > 0 && (
        <h1 className="text-3xl font-bold text-center mb-4">
          {slug
            .replace("-", " ")
            .split(" ")
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")}
        </h1>
      )}
      <div>
        {dishes.length > 0 ? (
          <div className="mt-4">
            <div className="space-y-6 flex items-center justify-between flex-wrap">
              {dishes.map((dish, index) => (
                <div key={index}>
                  <ProductCard
                    product={dish}
                    logo={dish.vendor.logo}
                    location={dish.vendor.location}
                    documentId={dish.vendor.documentId}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Custom404 />
          </div>
        )}
      </div>
    </div>
  );
}
