"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ProductCard from "../components/productCard";
import { FaFilter } from "react-icons/fa";
import Pagination from "../components/pagination";

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [vegetarianFilter, setVegetarianFilter] = useState(false);
  const [nonVegetarianFilter, setNonVegetarianFilter] = useState(false);
  const [spicinessFilter, setSpicinessFilter] = useState([]);
  const [ingredientsFilter, setIngredientsFilter] = useState([]);
  const [servingFilter, setServingFilter] = useState(0);
  const [dishAvailabilityFilter, setDishAvailabilityFilter] = useState(true);
  const [priceFilter, setPriceFilter] = useState([0, 500]);
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const getTodayDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return days[today.getDay()];
  };

  const isAvailableToday = (availableDays) => {
    const today = getTodayDay();
    return availableDays.includes(today);
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
        .sort((a, b) => b.rating - a.rating)
        .map((vendor) => {
          if (!vendor.menu) {
            return [];
          }
          return vendor.menu.map((dish) => ({
            ...dish,
            vendor: vendor,
            isVegetarian: dish.vegetarian,
            spiciness: dish.spiciness,
            ingredients: dish.ingredients,
            servingSize: dish.serving,
            dishAvailability: dish.dish_availability,
            price: parseFloat(dish.price),
            available_days: dish.available_days,
          }));
        })
        .flat();

      setDishes(dishes);
    } catch (error) {
      console.error("Error fetching dishes data:", error);
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchDish();
  }, []);

  const filteredDishes = dishes.filter(
    (dish) =>
      (vegetarianFilter ? dish.isVegetarian : true) &&
      (nonVegetarianFilter ? !dish.isVegetarian : true) &&
      (spicinessFilter.length > 0
        ? spicinessFilter.some((level) => dish.spiciness.includes(level))
        : true) &&
      (ingredientsFilter.length > 0
        ? ingredientsFilter.every((ingredient) =>
            dish.ingredients.includes(ingredient)
          )
        : true) &&
      dish.servingSize >= servingFilter &&
      (dishAvailabilityFilter ? isAvailableToday(dish.available_days) : true) &&
      dish.dishAvailability === "Available" &&
      dish.price >= priceFilter[0] &&
      dish.price <= priceFilter[1]
  );

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const availableSpicinessLevels = dishes
    .map((dish) => dish.spiciness)
    .flat()
    .filter((spiciness, index, self) => self.indexOf(spiciness) === index);

  const availableIngredients = dishes
    .map((dish) => dish.ingredients)
    .flat()
    .filter((ingredient, index, self) => self.indexOf(ingredient) === index);

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

  if (loadingDishes) {
    return <Loading />;
  }

  const closeFilterPopup = () => {
    setShowFilter(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold  mb-4">Menu</h1>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="font-bold text-slate-600"
          >
            Filter <FaFilter className="inline" />
          </button>
        </div>
      </div>

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

      {filteredDishes.length === 0 ? (
        <div>No Result Found</div>
      ) : (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold my-4 text-center">Dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {paginatedDishes.map((dish, index) => (
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
      )}

      {totalPages > 1 && (
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
