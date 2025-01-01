"use client"
import { useState } from "react";
import {
  FaTag,
  FaDollarSign,
  FaConciergeBell,
  FaFileAlt,
  FaUtensils,
  FaPizzaSlice,
  FaListOl,
  FaExclamationTriangle,
  FaLeaf,
  FaFireAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { LuVegan } from "react-icons/lu";

export default function AddMenu() {
  const [dish, setDish] = useState({
    name: "",
    price: "",
    serving: "",
    description: "",
    order_limit: "",
    dish_availability: "Available",
    ingredients: [],
    vegetarian: false,
    image: "",
    spiciness: [],
    cooking_time: "",
    category: "",
    allergen_info: [],
    available_days: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "allergen_info" || name === "ingredients") {
      setDish({
        ...dish,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      if (value < 0) return; // Prevent values less than 0
      setDish({
        ...dish,
        [name]: value,
      });
    }
  };

  const handleDaysChange = (day) => {
    const updatedDays = dish.available_days.includes(day)
      ? dish.available_days.filter((d) => d !== day)
      : [...dish.available_days, day];

    setDish({
      ...dish,
      available_days: updatedDays,
    });
  };

  const handleAvailabilityChange = (availability) => {
    setDish({
      ...dish,
      dish_availability: availability,
    });
  };

  const handleVegetarianChange = (isVegetarian) => {
    setDish({
      ...dish,
      vegetarian: isVegetarian,
    });
  };

  const handleSpicinessChange = (spicinessLevel) => {
    setDish((prevDish) => {
      const updatedSpiciness = prevDish.spiciness.includes(spicinessLevel)
        ? prevDish.spiciness.filter((level) => level !== spicinessLevel)
        : [...prevDish.spiciness, spicinessLevel];

      return {
        ...prevDish,
        spiciness: updatedSpiciness,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dish.available_days.length === 0) {
      alert("Please select at least one available day.");
      return;
    }

    console.log(JSON.stringify(dish));
  };

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-orange-500 mb-6">
          Add New Dish
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaTag className="inline mr-2" /> Dish Name
            </label>
            <input
              type="text"
              name="name"
              value={dish.name}
              onChange={handleChange}
              placeholder="e.g. Spaghetti Carbonara"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaDollarSign className="inline mr-2" /> Price
            </label>
            <input
              type="number"
              name="price"
              value={dish.price}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 12.99"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaConciergeBell className="inline mr-2" /> Serving Size
            </label>
            <input
              type="number"
              name="serving"
              value={dish.serving}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 2"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaFileAlt className="inline mr-2" /> Description
            </label>
            <textarea
              name="description"
              value={dish.description}
              onChange={handleChange}
              rows="4"
              placeholder="e.g. A classic Italian pasta dish with eggs, cheese, pancetta, and pepper."
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaListOl className="inline mr-2" /> Order Limit
            </label>
            <input
              type="number"
              name="order_limit"
              value={dish.order_limit}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 100"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaExclamationTriangle className="inline mr-2" /> Availability
            </label>
            <div className="flex items-center justify-around mt-2">
              <div
                onClick={() => handleAvailabilityChange("Available")}
                className={`w-32 flex items-center justify-center h-16 border-2 rounded-md text-center mx-2 font-semibold transition-all text-sm ${
                  dish.dish_availability === "Available"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                }`}
              >
                <MdEventAvailable className="inline mr-2" /> Available
              </div>
              <div
                onClick={() => handleAvailabilityChange("Unavailable")}
                className={`w-32 flex items-center justify-center h-16 border-2 rounded-md text-center mx-2 font-semibold transition-all text-sm ${
                  dish.dish_availability === "Unavailable"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                }`}
              >
                <CgUnavailable className="inline mr-2" /> Unavailable
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaUtensils className="inline mr-2" /> Ingredients
            </label>
            <input
              type="text"
              name="ingredients"
              value={dish.ingredients.join(", ")}
              onChange={handleChange}
              placeholder="e.g. Eggs, Pancetta, Parmesan, Pepper"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaLeaf className="inline mr-2" /> Vegetarian
            </label>
            <div className="flex items-center justify-around mt-2">
              <div
                onClick={() => handleVegetarianChange(true)}
                className={`w-32 flex items-center justify-center h-16 border-2 rounded-md text-center mx-2 font-semibold transition-all text-sm ${
                  dish.vegetarian
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                }`}
              >
                <LuVegan className="inline mr-2" /> Vegetarian
              </div>
              <div
                onClick={() => handleVegetarianChange(false)}
                className={`w-32 flex items-center justify-center h-16 border-2 rounded-md text-center mx-2 font-semibold transition-all text-sm ${
                  !dish.vegetarian
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                }`}
              >
                Non-Vegetarian
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaFireAlt className="inline mr-2" /> Spiciness
            </label>
            <div className="flex items-center justify-around mt-2">
              {["Sweet", "Mild", "Medium", "Hot", "Sweet & Spicy"].map(
                (level) => (
                  <div
                    key={level}
                    onClick={() => handleSpicinessChange(level)}
                    className={`w-32 flex items-center justify-center h-16 border-2 rounded-md text-center mx-2 font-semibold transition-all text-sm ${
                      dish.spiciness.includes(level)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                    }`}
                  >
                    {level}
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaClock className="inline mr-2" /> Cooking Time
            </label>
            <input
              type="text"
              name="cooking_time"
              value={dish.cooking_time}
              onChange={handleChange}
              placeholder="e.g. 20 minutes"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaPizzaSlice className="inline mr-2" /> Category
            </label>
            <input
              type="text"
              name="category"
              value={dish.category}
              onChange={handleChange}
              placeholder="e.g. Pasta"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaExclamationTriangle className="inline mr-2" /> Allergen Info
            </label>
            <input
              type="text"
              name="allergen_info"
              value={dish.allergen_info.join(", ")}
              onChange={handleChange}
              placeholder="e.g. Contains gluten, dairy"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaCalendarAlt className="inline mr-2" /> Available Days
            </label>
            <div className="flex items-center justify-around mt-2">
              {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaysChange(day)}
                  className={`w-10 h-10 border-2 rounded-full text-center mx-2 font-semibold transition-all text-sm ${
                    dish.available_days.includes(day)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "text-gray-700 border-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-700"
            >
              Add Dish
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}






at least one avaiavle day is must  have a defult day and also at least one spiceness have a defult value and convert category to option that contain value fruit,vegitable,fish,