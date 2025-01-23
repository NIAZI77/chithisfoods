"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import VendorCard from "../components/vendorCard";
import ProductCard from "../components/productCard";

export default function MenuPage() {
  const [data, setData] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(true);

  const fetchData = async () => {
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
      const data = await response.json();
      const sortedVendors = data.data.sort((a, b) => b.rating - a.rating);
      setData(sortedVendors);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchDish = async () => {
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
      const data = await response.json();
      const dishes = data.data
        .map((vendor) => {
          return vendor.menu.map((dish) => ({
            ...dish,
            vendor: vendor,
          }));
        })
        .flat();
      const sortedDishes = dishes.sort((a, b) => b.rating - a.rating);
      setDishes(sortedDishes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDish();
  }, []);

  if (loadingVendors || loadingDishes) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-[90%]">
      <h1 className="text-3xl font-bold text-center mb-4">Menu</h1>
      <div>
        {data.length === 0 && dishes.length === 0 ? (
          <div>No menu available</div>
        ) : (
          <>
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Dishes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dishes.map((dish, index) => (
                  <ProductCard
                    key={index}
                    product={dish}
                    logo={dish.vendor.logo}
                    location={dish.vendor.location}
                    documentId={dish.vendor.documentId}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Vendors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((vendor, index) => (
                  <VendorCard key={index} vendor={vendor} className="mx-auto" />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
