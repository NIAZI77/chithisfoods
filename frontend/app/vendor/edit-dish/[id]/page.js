"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCamera } from "react-icons/fa";
import Image from "next/image";
import { getCookie } from "cookies-next";
import Loading from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";

export default function EditDishPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dishData, setDishData] = useState({
    name: "",
    description: "",
    price: "",
    chef: {},
    image: { id: 0, url: "" },
    servings: "",
    category: "cooked-foods",
    subcategory: "",
    preparation_time: "",
    vendorId: "",
    ingredients: "",
    toppings: [],
    extras: [],
    spiciness: [],
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Category and subcategory mapping
  const categorySubcategories = {
    "cooked-foods": [
      { value: "vegetable-kurma", label: "Vegetable Kurma" },
      { value: "paneer-butter-masala", label: "Paneer Butter Masala" },
      { value: "sambar-rasam", label: "Sambar / Rasam" },
      { value: "chicken-curry", label: "Chicken Curry" },
      { value: "mutton-pepper-fry", label: "Mutton Pepper Fry" },
      { value: "fish-molee", label: "Fish Molee" },
      { value: "vegetable-biryani", label: "Vegetable Biryani" },
      { value: "chicken-biryani", label: "Chicken Biryani" },
      { value: "curd-lemon-rice", label: "Curd Rice / Lemon Rice" },
      { value: "idli", label: "Idli" },
      { value: "dosa", label: "Dosa" },
      { value: "uthappam", label: "Uthappam" },
      { value: "pongal", label: "Pongal" },
      { value: "vada", label: "Vada" },
      { value: "chapathi-kurma", label: "Chapathi with Kurma" },
      { value: "south-indian-veg-meal", label: "South Indian Veg Meal Box" },
      { value: "chicken-curry-rice", label: "Chicken Curry + Rice" },
      { value: "parotta-salna", label: "Parotta + Salna" },
    ],
    groceries: [
      { value: "sona-masoori", label: "Sona Masoori" },
      { value: "idli-rice", label: "Idli Rice" },
      { value: "wheat", label: "Wheat" },
      { value: "ragi", label: "Ragi" },
      { value: "toor-dal", label: "Toor Dal" },
      { value: "moong-dal", label: "Moong Dal" },
      { value: "urad-dal", label: "Urad Dal" },
      { value: "coconut-oil", label: "Coconut Oil" },
      { value: "sunflower-oil", label: "Sunflower Oil" },
      { value: "gingelly-oil", label: "Gingelly Oil" },
      { value: "atta", label: "Atta" },
      { value: "ragi-flour", label: "Ragi Flour" },
      { value: "maida", label: "Maida" },
      { value: "jaggery", label: "Jaggery" },
      { value: "sugar", label: "Sugar" },
      { value: "salt", label: "Salt" },
      { value: "pickles", label: "Pickles" },
      { value: "ready-mixes", label: "Ready Mixes" },
    ],
    spices: [
      { value: "mustard", label: "Mustard" },
      { value: "cumin", label: "Cumin" },
      { value: "cloves", label: "Cloves" },
      { value: "chili-powder", label: "Chili Powder" },
      { value: "turmeric", label: "Turmeric" },
      { value: "coriander", label: "Coriander" },
      { value: "sambar-powder", label: "Sambar Powder" },
      { value: "biryani-masala", label: "Biryani Masala" },
      { value: "garam-masala", label: "Garam Masala" },
      { value: "asafoetida", label: "Asafoetida" },
      { value: "chaat-masala", label: "Chaat Masala" },
    ],
    batter: [
      { value: "idli-batter", label: "Idli / Dosa Batter" },
      { value: "uthappam-batter", label: "Uthappam Batter" },
      { value: "adai-batter", label: "Adai / Multigrain Batter" },
      { value: "vada-batter", label: "Vada Batter" },
    ],
    fish: [
      { value: "rohu", label: "Rohu" },
      { value: "catla", label: "Catla" },
      { value: "tilapia", label: "Tilapia" },
      { value: "pomfret", label: "Pomfret" },
      { value: "seer", label: "Seer" },
      { value: "sardine", label: "Sardine" },
      { value: "prawns", label: "Prawns" },
      { value: "crabs", label: "Crabs" },
      { value: "fillets-slices", label: "Fillets / Slices" },
      { value: "marinated-fish", label: "Marinated Fish" },
      { value: "frozen-fish", label: "Frozen Fish" },
    ],
    meat: [
      { value: "whole-chicken", label: "Whole Chicken" },
      { value: "curry-cut", label: "Curry Cut Chicken" },
      { value: "boneless-chicken", label: "Boneless Chicken" },
      { value: "goat", label: "Goat Meat" },
      { value: "minced-mutton", label: "Minced Mutton" },
      { value: "pork", label: "Pork" },
      { value: "beef", label: "Beef" },
      { value: "liver", label: "Liver" },
      { value: "kidney", label: "Kidney" },
      { value: "marinated-meat", label: "Marinated Meat" },
      { value: "frozen-meat", label: "Frozen Meat" },
    ],
    snacks: [
      { value: "murukku", label: "Murukku" },
      { value: "thattai", label: "Thattai" },
      { value: "banana-chips", label: "Banana Chips" },
      { value: "mixture", label: "Mixture" },
      { value: "ladoo", label: "Ladoo" },
      { value: "halwa", label: "Halwa" },
      { value: "mysore-pak", label: "Mysore Pak" },
      { value: "samosa", label: "Samosa" },
      { value: "cutlet", label: "Cutlet" },
      { value: "spring-rolls", label: "Spring Rolls" },
      { value: "roasted-chana", label: "Roasted Chana" },
      { value: "millet-snacks", label: "Millet Snacks" },
    ],
  };

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user) {
      getDishData(id);
    } else {
      toast.error("Please login to continue.");
      router.push("/login");
    }
  }, []);
  const getDishData = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${id}?populate=*`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dish data");
      }
      const data = await response.json();
      setDishData(data.data);
    } catch (error) {
      console.error("Error fetching dish data", error);
      toast.error("Error fetching dish data");
    } finally {
      setLoading(false);
    }
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

      setDishData((prevData) => ({
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case "price":
        newValue = value.replace(/[^0-9.]/g, "");
        if (newValue.includes(".")) {
          const parts = newValue.split(".");
          parts[0] = parts[0].slice(0, 10);
          parts[1] = parts[1].slice(0, 2);
          newValue = parts.join(".");
        }
        break;
      case "servings":
      case "preparation_time":
        newValue = value.replace(/\D/g, "");
        break;
      case "ingredients":
        // Remove extra spaces and commas
        newValue = value.replace(/\s*,\s*/g, ", ").trim();
        break;
      case "category":
        // Reset subcategory when category changes
        setDishData((prev) => ({
          ...prev,
          [name]: value,
          subcategory: "", // Reset subcategory
        }));
        return; // Early return as we're using setDishData directly
    }

    setDishData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleArrayChange = (type, index, field, value, subIndex = null) => {
    const updated = [...dishData[type]];
    let newValue = value;
    if (field === "price") {
      newValue = value.replace(/[^0-9.]/g, "");
      if (newValue.includes(".")) {
        const parts = newValue.split(".");
        parts[0] = parts[0].slice(0, 10);
        parts[1] = parts[1].slice(0, 2);
        newValue = parts.join(".");
      }
    }
    if (subIndex !== null) {
      updated[index].options[subIndex][field] = newValue;
    } else {
      updated[index][field] = newValue;
    }
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const addOptionGroup = (type) => {
    const last = dishData[type].at(-1);
    if (
      dishData[type].length === 0 ||
      (last.name && last.options.every((opt) => opt.label && opt.price))
    ) {
      setDishData((prev) => ({
        ...prev,
        [type]: [
          ...prev[type],
          { name: "", options: [{ label: "", price: "" }] },
        ],
      }));
    } else {
      toast.warning(`Please complete the previous ${type.slice(0, -1)} first.`);
    }
  };

  const deleteOptionGroup = (type, index) => {
    const updated = dishData[type].filter((_, i) => i !== index);
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const isValid = () => {
    const complete = (list) =>
      list.every(
        (item) =>
          item.name && item.options.every((opt) => opt.label && opt.price)
      );
    return complete(dishData.toppings) && complete(dishData.extras);
  };
  const handleSpicinessChange = (spicinessLevel) => {
    setDishData((prevDishData) => {
      const updatedSpiciness = prevDishData.spiciness.includes(spicinessLevel)
        ? prevDishData.spiciness.filter((level) => level !== spicinessLevel)
        : [...prevDishData.spiciness, spicinessLevel];

      return {
        ...prevDishData,
        spiciness: updatedSpiciness,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      toast.error("Please complete all topping and extra fields.");
      return;
    }
    if (dishData.spiciness.length === 0) {
      toast.warning("Please select at least one spiciness level.");
      return;
    }
    if (dishData.image.url.length === 0) {
      toast.warning("Please upload image for the dish.");
      return;
    }
    setSubmitting(true);

    try {
      // Handle ingredients conversion
      let ingredientsArray;
      if (Array.isArray(dishData.ingredients)) {
        ingredientsArray = dishData.ingredients;
      } else if (typeof dishData.ingredients === "string") {
        ingredientsArray = dishData.ingredients
          .split(",")
          .map((item) => item.trim());
      } else {
        ingredientsArray = [];
      }

      const payload = {
        data: {
          name: dishData.name,
          description: dishData.description,
          price: parseFloat(dishData.price),
          servings: parseInt(dishData.servings),
          preparation_time: parseInt(dishData.preparation_time),
          category: dishData.category,
          subcategory: dishData.subcategory,
          ingredients: ingredientsArray,
          toppings: dishData.toppings || [],
          extras: dishData.extras || [],
          spiciness: dishData.spiciness || [],
          image: dishData.image.id,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to save dish");
      }

      toast.success("Dish saved successfully!");
      setTimeout(() => router.push("/vendor/manage-inventory"), 1000);
    } catch (error) {
      console.error("Error saving dish:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOption = (type, groupIndex, optionIndex) => {
    const updated = [...dishData[type]];
    updated[groupIndex].options = updated[groupIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const handleCategoryChange = (value) => {
    setDishData((prev) => ({
      ...prev,
      category: value,
      subcategory: categorySubcategories[value]?.[0]?.value || "",
    }));
  };

  const handleSubcategoryChange = (value) => {
    setDishData((prev) => ({
      ...prev,
      subcategory: value,
    }));
  };

  if (loading) return <Loading />;
  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen pl-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-orange-600">Edit Dish</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col my-2">
            <label htmlFor="name" className="text-sm text-slate-400 ml-2">
              Name
            </label>
            <input
              required
              name="name"
              placeholder="i.e Grilled Chicken Breast"
              value={dishData.name}
              onChange={handleChange}
              className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-md outline-orange-400 bg-slate-100"
            />
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="price" className="text-sm text-slate-400 ml-2">
              Price
            </label>
            <input
              required
              name="price"
              type="text"
              inputMode="decimal"
              placeholder="i.e 9.99"
              value={dishData.price}
              onChange={handleChange}
              className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-md outline-orange-400 bg-slate-100"
            />
          </div>
        </div>
        <div className="w-full col-span-2">
          <div className="relative w-full">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="hidden"
            />
            <Image
              height={100}
              width={100}
              src={dishData.image.url ? dishData.image.url : "/img.png"}
              alt="Dish"
              className="object-cover bg-center aspect-video shadow md:w-[50%] w-full mx-auto rounded-md"
            />
            <div className="w-8 h-8 overflow-hidden absolute right-10 bottom-5 cursor-pointer flex items-center justify-center rounded-full bg-white shadow">
              <label className="pl-0.5 h-5 w-5 text-center" htmlFor="image">
                <FaCamera className="cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col my-2">
            <Label className="mb-2 block text-sm text-slate-400 ml-2">
              Category
            </Label>
            <Select
              value={dishData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full bg-slate-100 rounded-md">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cooked-foods">Cooked Foods</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="spices">Spices</SelectItem>
                  <SelectItem value="batter">Batter</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col my-2">
            <Label className="mb-2 block text-sm text-slate-400 ml-2">
              Subcategory
            </Label>
            <Select
              value={dishData.subcategory}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger className="w-full bg-slate-100 rounded-md">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categorySubcategories[dishData.category]?.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col my-2">
            <label
              htmlFor="preparation_time"
              className="text-sm text-slate-400 ml-2"
            >
              Preparation Time
            </label>
            <input
              required
              name="preparation_time"
              type="text"
              inputMode="numeric"
              placeholder="i.e 45 (minutes)"
              value={dishData.preparation_time}
              onChange={handleChange}
              className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-md outline-orange-400 bg-slate-100"
            />
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="servings" className="text-sm text-slate-400 ml-2">
              Servings
            </label>
            <input
              required
              name="servings"
              type="text"
              inputMode="numeric"
              placeholder="i.e 2 "
              value={dishData.servings}
              onChange={handleChange}
              className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-md outline-orange-400 bg-slate-100"
            />
          </div>

          <div className="flex flex-col my-2 md:col-span-2">
            <label
              htmlFor="ingredients"
              className="text-sm text-slate-400 ml-2"
            >
              Ingredients
            </label>
            <input
              required
              name="ingredients"
              placeholder="i.e Chicken breast, Olive oil, Garlic"
              value={dishData.ingredients}
              onChange={handleChange}
              className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-md outline-orange-400 bg-slate-100"
            />
          </div>
        </div>

        <div className="flex flex-col my-2 md:col-span-2">
          <label htmlFor="description" className="text-sm text-slate-400 ml-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="i.e Juicy grilled chicken breast seasoned with herbs and spices"
            value={dishData.description}
            onChange={handleChange}
            className="w-full h-32 resize-none px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
          />
        </div>

        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          {["Sweet", "Mild", "Medium", "Hot", "Sweet & Spicy"].map((level) => (
            <div
              key={level}
              onClick={() => handleSpicinessChange(level)}
              className={`w-32 text-center cursor-pointer p-3 border-2 rounded-md text-xs font-semibold transition-all ${
                dishData.spiciness.includes(level)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {level}
            </div>
          ))}
        </div>

        <section className="space-y-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-orange-500">Toppings</h2>
            <button
              type="button"
              onClick={() => addOptionGroup("toppings")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
            >
              <PlusCircle size={20} /> Add Topping
            </button>
          </div>

          {dishData.toppings.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="p-6 rounded-lg mb-6 bg-white shadow-sm space-y-4 border border-gray-100"
            >
              <div className="flex justify-between items-center gap-4">
                <input
                  type="text"
                  placeholder="Topping Group Name"
                  value={group.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "toppings",
                      groupIndex,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => deleteOptionGroup("toppings", groupIndex)}
                  className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) =>
                        handleArrayChange(
                          "toppings",
                          groupIndex,
                          "label",
                          e.target.value,
                          optionIndex
                        )
                      }
                      className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={option.price}
                      onChange={(e) =>
                        handleArrayChange(
                          "toppings",
                          groupIndex,
                          "price",
                          e.target.value,
                          optionIndex
                        )
                      }
                      className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                    />
                    {group.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteOption("toppings", groupIndex, optionIndex)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = [...dishData.toppings];
                  updated[groupIndex].options.push({ label: "", price: "" });
                  setDishData((prev) => ({ ...prev, toppings: updated }));
                }}
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                + Add Option
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-orange-500">Extras</h2>
            <button
              type="button"
              onClick={() => addOptionGroup("extras")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
            >
              <PlusCircle size={20} /> Add Extra
            </button>
          </div>

          {dishData.extras.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="p-6 rounded-lg mb-6 bg-white shadow-sm space-y-4 border border-gray-100"
            >
              <div className="flex justify-between items-center gap-4">
                <input
                  type="text"
                  placeholder="Extra Group Name"
                  value={group.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "extras",
                      groupIndex,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => deleteOptionGroup("extras", groupIndex)}
                  className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) =>
                        handleArrayChange(
                          "extras",
                          groupIndex,
                          "label",
                          e.target.value,
                          optionIndex
                        )
                      }
                      className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={option.price}
                      onChange={(e) =>
                        handleArrayChange(
                          "extras",
                          groupIndex,
                          "price",
                          e.target.value,
                          optionIndex
                        )
                      }
                      className="w-full px-4 py-2 border rounded-full outline-orange-400 bg-slate-50"
                    />
                    {group.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteOption("extras", groupIndex, optionIndex)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = [...dishData.extras];
                  updated[groupIndex].options.push({ label: "", price: "" });
                  setDishData((prev) => ({ ...prev, extras: updated }));
                }}
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                + Add Option
              </button>
            </div>
          ))}
        </section>
        <button
          type="submit"
          className="bg-orange-600 text-white py-3 rounded-full shadow-orange-300 shadow-md hover:bg-orange-700 transition-all w-full mt-8 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={submitting || !isValid()}
        >
          {submitting ? (
            <>
              <Spinner size={20} />
            </>
          ) : (
            "Save Dish"
          )}
        </button>
      </form>
    </div>
  );
}
