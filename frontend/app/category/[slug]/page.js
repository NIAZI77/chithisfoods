"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import ProductCard from "@/app/components/productCard";
import { FaFilter } from "react-icons/fa";
import Pagination from "@/app/components/pagination";
import ShefNearMeSwitchToggle from "@/app/components/ShefNearMeSwitchToggle";
import NoResultFound from "@/app/components/noResultFound";
import TopRatedChefsToggle from "@/app/components/TopRatedChefsToggle";

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zipcode, setZipcode] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);

  // Filters
  const [vegetarianFilter, setVegetarianFilter] = useState(false);
  const [nonVegetarianFilter, setNonVegetarianFilter] = useState(false);
  const [spicinessFilter, setSpicinessFilter] = useState([]);
  const [ingredientsFilter, setIngredientsFilter] = useState([]);
  const [servingFilter, setServingFilter] = useState(0);
  const [dishAvailabilityFilter, setDishAvailabilityFilter] = useState(true);
  const [priceFilter, setPriceFilter] = useState([0, 500]);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Vendors Data
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
        setData(result.data.sort((a, b) => b.rating - a.rating));
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);
  const closeFilterPopup = () => {
    setShowFilter(false);
  };
  // Filter dishes based on the category and selected filters
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

      // Apply filters
      const filtered = filteredDishes.filter(
        (dish) =>
          (vegetarianFilter ? dish.vegetarian : true) &&
          (nonVegetarianFilter ? !dish.vegetarian : true) &&
          (spicinessFilter.length > 0
            ? spicinessFilter.some((level) => dish.spiciness.includes(level))
            : true) &&
          (ingredientsFilter.length > 0
            ? ingredientsFilter.every((ingredient) =>
                dish.ingredients.includes(ingredient)
              )
            : true) &&
          dish.serving >= servingFilter &&
          (dishAvailabilityFilter
            ? isAvailableToday(dish.available_days)
            : true) &&
          dish.dish_availability === "Available" &&
          dish.price >= priceFilter[0] &&
          dish.price <= priceFilter[1] &&
          (isOn && zipcode.length >= 5
            ? dish.vendor.location.zipcode == zipcode
            : true) &&
          (isTopRated ? dish.vendor.isTopRated === true : true)
      );

      setDishes(filtered);
      setTotalPages(Math.ceil(filtered.length / 9));
    }
  }, [
    slug,
    data,
    vegetarianFilter,
    nonVegetarianFilter,
    spicinessFilter,
    ingredientsFilter,
    servingFilter,
    dishAvailabilityFilter,
    priceFilter,
    isOn,
    zipcode,
    isTopRated,
  ]);

  // Helper function to get today's day
  const getTodayDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return days[today.getDay()];
  };

  // Check if a dish is available today
  const isAvailableToday = (availableDays) => {
    const today = getTodayDay();
    return availableDays.includes(today);
  };
  const displayedDishes = dishes.slice((currentPage - 1) * 9, currentPage * 9);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loading />;
  }
  // Prepare available spiciness levels and ingredients with counts
  const availableSpicinessLevels = dishes
    .map((dish) => dish.spiciness)
    .flat()
    .filter((level, index, self) => self.indexOf(level) === index);

  const availableIngredients = dishes
    .map((dish) => dish.ingredients)
    .flat()
    .filter((ingredient, index, self) => self.indexOf(ingredient) === index);

  // Count occurrences for spiciness and ingredients
  const spicinessCount = availableSpicinessLevels.reduce((acc, level) => {
    acc[level] = dishes.filter((dish) => dish.spiciness.includes(level)).length;
    return acc;
  }, {});

  const ingredientsCount = availableIngredients.reduce((acc, ingredient) => {
    acc[ingredient] = dishes.filter((dish) =>
      dish.ingredients.includes(ingredient)
    ).length;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 w-[95%]">
      <div className="flex items-center justify-between md:mb-8 mb-2">
        <h1 className="md:text-2xl text-sm font-bold">
          {slug
            .replace("-", " ")
            .split(" ")
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")}
        </h1>
        <div>
          <ShefNearMeSwitchToggle setZipcode={setZipcode} setIsOn={setIsOn} />
        </div>
        <div className="flex justify-between content-center items-center">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="font-bold text-slate-600 md:text-lg text-xs"
          >
            Filter <FaFilter className="inline" />
          </button>
        </div>
      </div>
      <div>
        <TopRatedChefsToggle setIsTopRated={setIsTopRated} />
      </div>
      {/* Filter Popup */}
      {showFilter && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold text-center mb-4">Filter Menu</h2>

          <div className="mb-4">
            <label>
              <input
                type="checkbox"
                checked={vegetarianFilter}
                onChange={(e) => setVegetarianFilter(e.target.checked)}
              />
              <span className="ml-2">Vegetarian Dishes</span>
            </label>
          </div>

          <div className="mb-4">
            <label>
              <input
                type="checkbox"
                checked={nonVegetarianFilter}
                onChange={(e) => setNonVegetarianFilter(e.target.checked)}
              />
              <span className="ml-2">Non-Vegetarian Dishes</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-lg">Spiciness Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {availableSpicinessLevels.map((level) => (
                <label key={level}>
                  <input
                    type="checkbox"
                    value={level}
                    checked={spicinessFilter.includes(level)}
                    onChange={(e) => {
                      const newSpicinessFilter = e.target.checked
                        ? [...spicinessFilter, level]
                        : spicinessFilter.filter((item) => item !== level);
                      setSpicinessFilter(newSpicinessFilter);
                    }}
                  />
                  <span className="ml-2">
                    {level} ({spicinessCount[level]})
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-lg">Dish Availability</label>
            <input
              type="checkbox"
              checked={dishAvailabilityFilter}
              onChange={(e) => setDishAvailabilityFilter(e.target.checked)}
            />
            <span className="ml-2">Today Available</span>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-lg">
              Minimum Serving Size
            </label>
            <input
              type="number"
              value={servingFilter}
              onChange={(e) => setServingFilter(Number(e.target.value))}
              className="w-full border p-2 mt-2"
              min={1}
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-lg">Price Range</label>
            <div className="flex justify-between">
              <input
                type="number"
                value={priceFilter[0]}
                onChange={(e) =>
                  setPriceFilter([
                    parseFloat(e.target.value) || 0,
                    priceFilter[1],
                  ])
                }
                className="w-[45%] border p-2"
                min={0}
              />
              <input
                type="number"
                value={priceFilter[1]}
                onChange={(e) =>
                  setPriceFilter([
                    priceFilter[0],
                    parseFloat(e.target.value) || 0,
                  ])
                }
                className="w-[45%] border p-2"
                min={0}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-lg">Ingredients</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(ingredientsCount)
                .filter(([ingredient, count]) => count >= 5)
                .map(([ingredient, count]) => (
                  <label key={ingredient}>
                    <input
                      type="checkbox"
                      value={ingredient}
                      checked={ingredientsFilter.includes(ingredient)}
                      onChange={(e) => {
                        const newIngredientsFilter = e.target.checked
                          ? [...ingredientsFilter, ingredient]
                          : ingredientsFilter.filter(
                              (item) => item !== ingredient
                            );
                        setIngredientsFilter(newIngredientsFilter);
                      }}
                    />
                    <span className="ml-2 text-sm">
                      {ingredient} ({count})
                    </span>
                  </label>
                ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeFilterPopup}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      {/* Display Dishes */}
      <div className="mt-4">
        {displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-5 justify-items-center">
            {displayedDishes.length > 0 &&
              displayedDishes.map((dish, index) => (
                <ProductCard
                  key={index}
                  product={dish}
                  logo={dish.vendor.logo}
                  location={dish.vendor.location}
                  documentId={dish.vendor.documentId}
                />
              ))}
          </div>
        ) : (
          <NoResultFound />
        )}
      </div>

      {dishes.length > 8 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
