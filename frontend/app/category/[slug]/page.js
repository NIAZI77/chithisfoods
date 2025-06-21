"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Menu, Search, X, ChevronRight, FilterIcon } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Pagination from "@/app/components/pagination";
import DishCard from "@/app/components/DishCard";
import FilterPopup from "./components/FilterPopup";

const Page = () => {
  const { slug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [activeSubSubCategory, setActiveSubSubCategory] = useState("All");
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    rating: 0,
    spiceLevel: "",
    priceRange: [0, 1000],
  });

  const fetchDishes = useCallback(
    async (subcategory, page, search = "", subSubCategory = "All") => {
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
      const searchFilter = search ? `&filters[name][$containsi]=${search}` : "";
      const subSubCategoryFilter =
        subSubCategory && subSubCategory !== "All"
          ? `&filters[subSubCategory][$eq]=${subSubCategory}`
          : "";

      const url =
        subcategory === "All"
          ? `${baseUrl}?${filters}${searchFilter}${subSubCategoryFilter}&${populate}&${pagination}`
          : `${baseUrl}?${filters}${searchFilter}&filters[subcategory][$eq]=${subcategory}${subSubCategoryFilter}&${populate}&${pagination}`;

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
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[zipcode][$eq]=${zipcode}&filters[category][$eq]=${slug}&fields[0]=subcategory&pagination[limit]=9999999999`,
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

      // Extract unique subcategories (remove dishCounts logic)
      const uniqueSubcategories = [
        ...new Set(dishes.map((dish) => dish?.subcategory).filter(Boolean)),
      ];
      setSubcategories(uniqueSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Unable to load subcategories. Please try again later");
      setSubcategories([]);
    }
  }, [slug]);

  useEffect(() => {
    getSubcategories();
    fetchDishes("All", 1, "", activeSubSubCategory);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchDishes(activeSubcategory, 1, currentSearchQuery, activeSubSubCategory);
  }, [activeSubcategory, fetchDishes, activeSubSubCategory]);

  const filteredDishes = useMemo(() => {
    let dishes = allDishes;

    if (activeSubcategory !== "All") {
      dishes = dishes.filter(
        (dish) =>
          dish?.subcategory?.toLowerCase() === activeSubcategory.toLowerCase()
      );
    }

    if (activeSubSubCategory !== "All") {
      dishes = dishes.filter(
        (dish) =>
          dish?.subSubCategory?.toLowerCase() ===
          activeSubSubCategory.toLowerCase()
      );
    }

    // Apply additional filters
    if (appliedFilters.rating > 0) {
      dishes = dishes.filter((dish) => dish.rating >= appliedFilters.rating);
    }

    if (appliedFilters.spiceLevel) {
      dishes = dishes.filter((dish) => 
        dish.spiciness && dish.spiciness.includes(appliedFilters.spiceLevel)
      );
    }

    if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 100) {
      dishes = dishes.filter((dish) => 
        dish.price >= appliedFilters.priceRange[0] && 
        dish.price <= appliedFilters.priceRange[1]
      );
    }

    return dishes;
  }, [allDishes, activeSubcategory, activeSubSubCategory, appliedFilters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDishes(
      activeSubcategory,
      page,
      currentSearchQuery,
      activeSubSubCategory
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentSearchQuery(searchQuery);
    setCurrentPage(1);
    fetchDishes(activeSubcategory, 1, searchQuery, activeSubSubCategory);
  };

  useEffect(() => {
    if (!isSearching) {
      fetchDishes(
        activeSubcategory,
        currentPage,
        currentSearchQuery,
        activeSubSubCategory
      );
    }
  }, [
    activeSubcategory,
    currentPage,
    fetchDishes,
    currentSearchQuery,
    isSearching,
    activeSubSubCategory,
  ]);

  const handleSubcategoryChange = (subcategory) => {
    setActiveSubcategory(subcategory);
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery("");
    setCurrentSearchQuery("");
    setActiveSubSubCategory("All");
  };

  useEffect(() => {
    if (activeSubcategory === "All") {
      setSubSubCategories([]);
      return;
    }
    const filtered = allDishes.filter(
      (dish) =>
        dish?.subcategory?.toLowerCase() === activeSubcategory.toLowerCase()
    );
    const uniqueSubSubCategories = [
      ...new Set(filtered.map((dish) => dish.subSubCategory).filter(Boolean)),
    ];
    setSubSubCategories(uniqueSubSubCategories);
  }, [allDishes, activeSubcategory]);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const hasActiveFilters = appliedFilters.rating > 0 || 
    appliedFilters.spiceLevel || 
    appliedFilters.priceRange[0] > 0 || 
    appliedFilters.priceRange[1] < 100;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <button
        className="md:hidden p-4 text-red-600 flex items-center gap-2"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
        <span>Menu</span>
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 duration-300 transition-all fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 p-6 flex flex-col gap-6 pt-16 md:pt-0`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div>
          <p className="font-semibold text-red-600 mb-4">Sub Categories</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li
              className={`cursor-pointer hover:text-red-600 flex items-center justify-between ${activeSubcategory === "All" ? "text-red-600 font-bold" : ""
                }`}
              onClick={() => handleSubcategoryChange("All")}
            >
              <span>All</span>
              {activeSubcategory === "All" && (
                <ChevronRight className="w-4 h-4" />
              )}
            </li>
            {subcategories.length > 0 ? (
              subcategories.map((item) => (
                <li
                  key={item}
                  className={`cursor-pointer hover:text-red-600 capitalize flex items-center justify-between ${activeSubcategory === item ? "text-red-600 font-bold" : ""
                    }`}
                  onClick={() => handleSubcategoryChange(item)}
                >
                  <span>{item}</span>
                  {activeSubcategory === item && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No subcategories available</p>
            )}
          </ul>

          {subSubCategories.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="font-semibold text-red-600 mb-2">
                Sub Sub Categories
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li
                  className={`cursor-pointer hover:text-red-600 flex items-center justify-between ${activeSubSubCategory === "All"
                    ? "text-red-600 font-bold"
                    : ""
                    }`}
                  onClick={() => setActiveSubSubCategory("All")}
                >
                  <span>All</span>
                  {activeSubSubCategory === "All" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </li>
                {subSubCategories.map((ssc) => (
                  <li
                    key={ssc}
                    className={`cursor-pointer hover:text-red-600 capitalize flex items-center justify-between ${activeSubSubCategory === ssc
                      ? "text-red-600 font-bold"
                      : ""
                      }`}
                    onClick={() => setActiveSubSubCategory(ssc)}
                  >
                    <span>{ssc}</span>
                    {activeSubSubCategory === ssc && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 px-6 md:pt-0">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {slug?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-col-reverse md:flex-row">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex items-center">
                <input
                  type="search"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes..."
                  className="bg-gray-100 pl-10 pr-4 py-2 rounded-l-full border-none outline-none w-full sm:w-64"
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3" />
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white px-3 py-2 rounded-r-full border-none outline-none hover:bg-red-700 transition duration-200"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                hasActiveFilters 
                  ? "bg-red-100 text-red-700 border border-red-300" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setFilterPopupOpen(true)}
            >
              <FilterIcon className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 2xl:grid-cols-4 place-items-center">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)
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

      <FilterPopup
        isOpen={filterPopupOpen}
        onClose={() => setFilterPopupOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
};

export default Page;
