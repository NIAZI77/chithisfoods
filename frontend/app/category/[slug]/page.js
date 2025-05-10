"use client";

import ProductCard from "@/app/components/DishCard";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";

const Page = () => {
  const { slug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("All");

  const fetchDishes = async () => {
    if (!slug) return;

    setLoading(true);
    const zipcode = localStorage.getItem("zipcode");
    if (!zipcode) {
      toast.error("Please set your location to view dishes.");
      return;
    }
    // Fetch dishes based on the category slug only
    const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[category][$eq]=${slug}&populate=*`;

    // Fetch dishes based on the category slug and zipcode
    // const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[zipcode][$eq]=${zipcode}&filters[category][$eq]=${slug}&populate=*`;


    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });

      const resultText = await response.text();
      try {
        const result = JSON.parse(resultText);

        if (response.ok && Array.isArray(result?.data)) {
          setDishes(result.data);
          setFilteredDishes(result.data);
          const subcategoriesFromDishes = [
            ...new Set(result.data.map((dish) => dish.subcategory)),
          ];
          setSubcategories(subcategoriesFromDishes);
        } else {
          toast.info("No dishes found in this category.");
        }
      } catch (jsonErr) {
        console.error("Invalid JSON:", resultText);
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      toast.error("Unable to load dishes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [slug]);

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(subcategory);
    if (subcategory === "All") {
      setFilteredDishes(dishes); // Show all dishes
    } else {
      const filtered = dishes.filter(
        (dish) => dish?.subcategory?.toLowerCase() === subcategory.toLowerCase()
      );
      setFilteredDishes(filtered);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile menu toggle button */}
      <button
        className="md:hidden p-4 text-red-600 flex items-center gap-2"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
        Menu
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 duration-300 transition-all fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 p-6 flex flex-col gap-6 pt-16 md:pt-0`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div>
          <p className="font-semibold text-red-600 mb-4">Sub Categories</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li
              className={`cursor-pointer hover:text-red-600 ${
                activeSubcategory === "All" ? "text-red-600 font-bold" : ""
              }`}
              onClick={() => handleSubcategoryClick("All")}
            >
              ({dishes.length}) All
            </li>
            {subcategories.length > 0 ? (
              subcategories.map((item) => (
                <li
                  key={item}
                  className={`cursor-pointer hover:text-red-600 ${
                    activeSubcategory === item ? "text-red-600 font-bold" : ""
                  }`}
                  onClick={() => handleSubcategoryClick(item)}
                >
                  (
                  {
                    dishes.filter(
                      (dish) =>
                        dish?.subcategory?.toLowerCase() === item.toLowerCase()
                    ).length
                  }
                  ) {item}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No subcategories available</p>
            )}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 md:pt-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {slug?.replace("-", " ")}
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 2xl:grid-cols-4 place-items-center">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <ProductCard key={dish.id} dish={dish} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No dishes found in this category.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
