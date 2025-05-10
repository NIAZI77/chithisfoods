"use client";

import ProductCard from "@/app/components/DishCard";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";

const Page = () => {
  const { slug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [dishCounts, setDishCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const fetchDishes = useCallback(
    async (subcategory, page) => {
      if (!slug) return;

      const zipcode = localStorage.getItem("zipcode");
      if (!zipcode) {
        toast.error(
          "Please set your delivery location to view available dishes"
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes`;
      const filters = `filters[zipcode][$eq]=${zipcode}&filters[category][$eq]=${slug}`;
      const populate = "populate=*";
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;

      const url =
        subcategory === "All"
          ? `${baseUrl}?${filters}&${populate}&${pagination}`
          : `${baseUrl}?${filters}&filters[subcategory][$eq]=${subcategory}&${populate}&${pagination}`;

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dishes: ${response.status}`);
        }

        const result = await response.json();
        const dishes = result?.data || [];
        setAllDishes(dishes);
        
        // Update pagination info
        setTotalItems(result.meta.pagination.total);
        setTotalPages(result.meta.pagination.pageCount);

        if (!dishes.length) {
          toast.info("No dishes available in your area for this category");
        }
      } catch (error) {
        console.error("Error fetching dishes:", error);
        toast.error("Unable to load dishes. Please try again later");
        setAllDishes([]);
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  const getSubcategories = useCallback(async () => {
    const zipcode = localStorage.getItem("zipcode");
    if (!zipcode) {
      toast.error("Please set your delivery location to view available dishes");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[zipcode][$eq]=${zipcode}&filters[category][$eq]=${slug}&fields[0]=subcategory&pagination[limit]=1000`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories: ${response.status}`);
      }

      const result = await response.json();
      const dishes = result?.data || [];

      // Extract unique subcategories and their counts
      const subcategoryMap = dishes.reduce((acc, dish) => {
        const subcategory = dish?.subcategory;
        if (subcategory) {
          acc[subcategory] = (acc[subcategory] || 0) + 1;
        }
        return acc;
      }, {});

      const uniqueSubcategories = Object.keys(subcategoryMap);
      setSubcategories(uniqueSubcategories);
      setDishCounts(subcategoryMap);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Unable to load subcategories. Please try again later");
      setSubcategories([]);
      setDishCounts({});
    }
  }, [slug]);

  useEffect(() => {
    getSubcategories();
    fetchDishes("All", 1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchDishes(activeSubcategory, 1);
  }, [activeSubcategory, fetchDishes]);

  const filteredDishes = useMemo(() => {
    if (activeSubcategory === "All") return allDishes;
    return allDishes.filter(
      (dish) =>
        dish?.subcategory?.toLowerCase() === activeSubcategory.toLowerCase()
    );
  }, [allDishes, activeSubcategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDishes(activeSubcategory, page);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <button
        className="md:hidden p-4 text-red-600 flex items-center gap-2"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
        Menu
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 duration-300 transition-all fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 p-6 flex flex-col gap-6 pt-16 md:pt-0`}
      >
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
              onClick={() => setActiveSubcategory("All")}
            >
              ({Object.values(dishCounts).reduce((a, b) => a + b, 0)}) All
            </li>
            {subcategories.length > 0 ? (
              subcategories.map((item) => (
                <li
                  key={item}
                  className={`cursor-pointer hover:text-red-600 capitalize ${
                    activeSubcategory === item ? "text-red-600 font-bold" : ""
                  }`}
                  onClick={() => setActiveSubcategory(item)}
                >
                  ({dishCounts[item] || 0}) {item}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No subcategories available</p>
            )}
          </ul>
        </div>
      </aside>

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
              No dishes available in this category
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default Page;
