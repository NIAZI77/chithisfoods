"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FaCamera,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { LuVegan } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditDish({ params }) {
  const { id } = use(params);
  const [dish, setDish] = useState({
    name: "",
    price: "",
    serving: "",
    description: "",
    dish_availability: "Available",
    ingredients: [],
    vegetarian: false,
    image: { id: 0, url: "" },
    spiciness: ["Mild"],
    cooking_time: "",
    category: "Vegetable",
    available_days: ["Mon"],
  });
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    function getCookie(name) {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    }

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }
    const fetchVendorData = async (email) => {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error.message || "Error fetching vendor data.");
        } else {
          const vendorData = data.data[0];
          setFormData(vendorData);
          let di = (vendorData.menu ?? []).find((dish) => dish.id == id);
          setDish(di);
          setFormData((prevData) => ({
            ...prevData,
            description: vendorData.description[0].children[0].text,
          }));
        }
      } catch (error) {
        toast.error("Error fetching vendor data.");
        console.error(error);
      }
    };
    fetchVendorData(storedUser);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ingredients") {
      setDish({
        ...dish,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
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

  const uploadImage = async (file, name) => {
    const formData = new FormData();
    formData.append("files", file);

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Error uploading image");
        return;
      }

      const data = await response.json();
      const { id, url } = data[0];

      setDish((prevData) => ({
        ...prevData,
        [name]: { id, url },
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Error uploading image");
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      uploadImage(file, name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dish.available_days.length === 0) {
      toast.warning("Please select at least one available day.");
      return;
    }
    if (dish.spiciness.length === 0) {
      toast.warning("Please select at least one spiciness level.");
      return;
    }
    if (dish.image.url === "") {
      toast.warning("Please upload an image.");
      return;
    }
    let menu = formData.menu;
    let index = menu.findIndex((d) => d.id == id);
    menu[index] = dish;
    const isDuplicateName = formData.menu.some(
      (existingDish) =>
        existingDish.name === dish.name && dish.id !== existingDish.id
    );
    if (isDuplicateName) {
      toast.warning("Dish must have a different name.");
      return;
    }

    if (!dish.id) {
      dish.id = new Date().getTime();
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${formData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              menu: menu,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Dish Updated successfully!");
        setTimeout(() => {
          router.push("/vendor/inventory");
        }, 1000);
      } else {
        toast.error(data.error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-orange-500 mb-6">
          Update Dish
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-full h-64 mb-4">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="hidden"
            />
            <img
              src={
                dish.image.url
                  ? dish.image.url
                  : "https://via.placeholder.com/300x900"
              }
              alt="Dish"
              className="md:w-3/4 w-full mx-auto h-64 object-cover"
            />
            <label
              className="w-5 h-5 overflow-hidden absolute right-10 bottom-5 cursor-pointer"
              htmlFor="image"
            >
              <FaCamera />
            </label>
          </div>
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
              placeholder="e.g. 12"
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
              <FaPizzaSlice className="inline mr-2" /> Category
            </label>
            <select
              name="category"
              value={dish.category}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="Vegetable">Vegetable</option>
              <option value="Fish">Fish</option>
              <option value="Fruit">Fruit</option>
              <option value="Spice">Spice</option>
              <option value="Butter">Butter</option>
              <option value="Cooked Food">Cooked Food</option>
            </select>
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
            <div className="flex items-center justify-between mt-2 flex-wrap space-y-2">
              {["Sweet", "Mild", "Medium", "Hot", "Sweet & Spicy"].map(
                (level) => (
                  <div
                    key={level}
                    onClick={() => handleSpicinessChange(level)}
                    className={`w-32 text-center cursor-pointer p-3 border-2 rounded-md mx-2 text-xs font-semibold transition-all ${
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
              <FaClock className="inline mr-2" /> Cooking Time (in minutes)
            </label>
            <input
              type="number"
              name="cooking_time"
              value={dish.cooking_time}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 30"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FaCalendarAlt className="inline mr-2" /> Available Days
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  onClick={() => handleDaysChange(day)}
                  className={`text-center cursor-pointer w-10 h-10 text-xs font-semibold content-center rounded-full border-2 ${
                    dish.available_days.includes(day)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-orange-500 text-white rounded-md text-lg font-semibold mt-4 hover:bg-orange-600 transition-colors"
          >
            Update Dish
          </button>
        </form>
      </div>
      <ToastContainer />
    </main>
  );
}
