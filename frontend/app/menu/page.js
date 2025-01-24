"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import VendorCard from "../components/vendorCard";
import ProductCard from "../components/productCard";
import { FaStar } from "react-icons/fa";

export default function MenuPage() {
  const [data, setData] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [vegetarianFilter, setVegetarianFilter] = useState(false);
  const [nonVegetarianFilter, setNonVegetarianFilter] = useState(false); // New state for non-vegetarian filter
  const [spicinessFilter, setSpicinessFilter] = useState([]);
  const [ingredientsFilter, setIngredientsFilter] = useState([]);
  const [servingFilter, setServingFilter] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

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
      console.error("Error fetching vendors data:", error);
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
            rating: dish.rating,
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
    fetchData();
    fetchDish();
  }, []);

  const filteredVendors = data.filter(
    (vendor) => vendor.rating >= ratingFilter
  );

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.rating >= ratingFilter &&
      (vegetarianFilter ? dish.isVegetarian : true) &&
      (nonVegetarianFilter ? !dish.isVegetarian : true) && // Filter for non-vegetarian
      (spicinessFilter.length > 0
        ? spicinessFilter.some((level) => dish.spiciness.includes(level))
        : true) &&
      (ingredientsFilter.length > 0
        ? ingredientsFilter.every((ingredient) =>
            dish.ingredients.includes(ingredient)
          )
        : true) &&
      dish.servingSize >= servingFilter
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

  if (loadingVendors || loadingDishes) {
    return <Loading />;
  }

  const closeFilterPopup = () => {
    setShowFilter(false);
  };

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-[90%]">
      <h1 className="text-3xl font-bold text-center mb-4">Menu</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showFilter ? "Hide Filter" : "Filter Menu"}
        </button>
      </div>

      {showFilter && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold text-center mb-4">Filter Menu</h2>

          <div className="mb-4">
            <h3 className="font-semibold">Rating Filter</h3>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`inline cursor-pointer text-2xl ${
                    star <= ratingFilter ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRatingFilter(star)}
                />
              ))}
            </div>
          </div>

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
                checked={nonVegetarianFilter} // Added checkbox for non-vegetarian filter
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
            <label className="block font-bold text-lg">Ingredients</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {availableIngredients.map((ingredient) => (
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
                    {ingredient} ({ingredientsCount[ingredient]})
                  </span>
                </label>
              ))}
            </div>
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

          <div className="flex justify-end">
            <button
              onClick={closeFilterPopup}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Filter
            </button>
          </div>
        </div>
      )}

      {filteredVendors.length === 0 && filteredDishes.length === 0 ? (
        <div>No Result Found</div>
      ) : (
        <>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold my-4 text-center">Dishes</h2>
            {filteredDishes.length === 0 ? (
              <div>No Result Found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDishes.map((dish, index) => (
                  <ProductCard
                    key={index}
                    product={dish}
                    logo={dish.vendor.logo}
                    location={dish.vendor.location}
                    documentId={dish.vendor.documentId}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold my-4 text-center">Vendors</h2>
            {filteredVendors.length === 0 ? (
              <div>No Result Found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredVendors.map((vendor, index) => (
                  <VendorCard key={index} vendor={vendor} className="mx-auto" />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
