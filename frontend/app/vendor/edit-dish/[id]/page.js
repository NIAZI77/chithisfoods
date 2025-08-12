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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCamera } from "react-icons/fa";
import { getCookie } from "cookies-next";
import Loading from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";

export default function EditDishPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dishData, setDishData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user && id) {
      getChefData(user);
      fetchCategories();
      fetchDishData(id);
    } else {
      toast.error("Please login to continue.");
      router.push("/login");
    }
  }, [router,id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data);

      // Set initial category and subcategory if available
      if (data.data.length > 0) {
        setDishData((prev) => ({
          ...prev,
          category: data.data[0].name,
          subcategory: data.data[0].subcategories[0]?.name || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };
  const fetchDishData = async (documentId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${documentId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dish");
      }

      const data = await response.json();
      setDishData(data.data);
    } catch (error) {
      console.error("Error fetching Dish:", error);
      toast.error("Failed to load Dish");
    }
  };

  const getChefData = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${email}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data?.data?.length > 0) {
        setDishData((prev) => ({
          ...prev,
          zipcode: data.data[0].zipcode,
          vendorId: data.data[0].documentId,
          email: data.data[0].email,
        }));
      } else {
        toast.error("We couldn't verify your vendor.");
        router.push("/become-a-vendor");
      }
    } catch (err) {
      toast.error("We couldn't verify your vendor. Please try again shortly.");
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
    if (name === "price") {
      newValue = value.replace(/[^0-9.]/g, "");
      if (newValue.includes(".")) {
        const parts = newValue.split(".");
        parts[0] = parts[0].slice(0, 10);
        parts[1] = parts[1].slice(0, 2);
        newValue = parts.join(".");
      }
    }
    if (name === "servings" || name === "preparation_time") {
      newValue = value.replace(/\D/g, "");
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

  const canAddNewGroup = (type) => {
    const last = dishData[type].at(-1);
    return (
      dishData[type].length === 0 ||
      (last?.name && last.options.every((opt) => opt.label && opt.price))
    );
  };

  const addGroup = (type) => {
    if (!canAddNewGroup(type)) {
      toast.warning(`Please complete the previous ${type.slice(0, -1)} first.`);
      return;
    }
    const newGroup = {
      name: "",
      mode: "included",
      options: [{ label: "included", price: "0.00" }],
    };
    setDishData((prev) => ({ ...prev, [type]: [...prev[type], newGroup] }));
  };

  const handleModeChange = (type, groupIndex, mode) => {
    const updated = [...dishData[type]];
    updated[groupIndex].mode = mode;
    updated[groupIndex].options =
      mode === "included"
        ? [{ label: "included", price: "0.00" }]
        : [{ label: "", price: "0.00" }];
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const deleteOptionGroup = (type, index) => {
    const updated = dishData[type].filter((_, i) => i !== index);
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const deleteOption = (type, groupIndex, optionIndex) => {
    const updated = [...dishData[type]];
    updated[groupIndex].options = updated[groupIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setDishData((prev) => ({ ...prev, [type]: updated }));
  };

  const isIncludedGroup = (group) => group.mode === "included";

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
      // Clean nested objects to remove any documentId fields
      const cleanImage = dishData.image ? {
        id: dishData.image.id,
        url: dishData.image.url
      } : null;
      
      const cleanToppings = dishData.toppings ? dishData.toppings.map(topping => ({
        name: topping.name,
        mode: topping.mode,
        options: topping.options.map(option => ({
          label: option.label,
          price: option.price
        }))
      })) : [];
      
      const cleanExtras = dishData.extras ? dishData.extras.map(extra => ({
        name: extra.name,
        mode: extra.mode,
        options: extra.options.map(option => ({
          label: option.label,
          price: option.price
        }))
      })) : [];
      
      const payload = {
        name: dishData.name,
        price: parseFloat(dishData.price),
        servings: parseInt(dishData.servings),
        preparation_time: parseInt(dishData.preparation_time),
        description: dishData.description,
        category: dishData.category,
        subcategory: dishData.subcategory,
        subSubCategory: dishData.subSubCategory,
        spiciness: dishData.spiciness,
        toppings: cleanToppings,
        extras: cleanExtras,
        image: cleanImage,
        ingredients: typeof dishData.ingredients === 'string' ? dishData.ingredients.split(",").map((item) => item.trim()) : Array.isArray(dishData.ingredients) ? dishData.ingredients : [],
      };
      
      console.log('Payload being sent:', payload);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: payload }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to update dish: ${response.status} ${response.statusText}`);
      }

      toast.success("Dish updated successfully!");
      setTimeout(() => router.push("/vendor/manage-inventory"), 1000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error updating dish:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    setDishData((prev) => ({
      ...prev,
      category: value,
      subcategory: selectedCategory?.subcategories[0]?.name || "",
      subSubCategory: "other", // Set default to "other"
    }));
  };

  const handleSubcategoryChange = (value) => {
    const selectedCategory = categories.find(
      (cat) => cat.name === dishData.category
    );
    const selectedSubcategory = selectedCategory?.subcategories.find(
      (sub) => sub.name === value
    );

    setDishData((prev) => ({
      ...prev,
      subcategory: value,
      subSubCategory: "other", // Reset to "other" when subcategory changes
    }));
  };

  const handleSubSubCategoryChange = (value) => {
    setDishData((prev) => ({
      ...prev,
      subSubCategory: value,
    }));
  };

  if (loading) return <Loading />;
  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen pl-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-orange-600">Add Dish</h1>

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
              className="w-full px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
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
              className="w-full px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
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
            <img
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)}
                    </SelectItem>
                  ))}
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
                  {categories
                    .find((cat) => cat.name === dishData.category)
                    ?.subcategories.map((subcat) => (
                      <SelectItem key={subcat.name} value={subcat.name}>
                        {subcat.name
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(() => {
            const selectedCategory = categories.find(
              (cat) => cat.name === dishData.category
            );
            const selectedSubcategory = selectedCategory?.subcategories.find(
              (sub) => sub.name === dishData.subcategory
            );

            if (selectedSubcategory) {
              return (
                <div className="flex flex-col my-2 md:col-span-2">
                  <Label className="mb-2 block text-sm text-slate-400 ml-2">
                    Sub Subcategory
                  </Label>
                  <Select
                    value={dishData.subSubCategory}
                    onValueChange={handleSubSubCategoryChange}
                  >
                    <SelectTrigger className="w-full bg-slate-100 rounded-md">
                      <SelectValue placeholder="Select a sub subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="other">Other</SelectItem>
                        {selectedSubcategory.subSubcategories.map(
                          (subSubcat) => (
                            <SelectItem key={subSubcat} value={subSubcat}>
                              {subSubcat
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            }
            return null;
          })()}

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
              className="w-full px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
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
              placeholder="i.e 2"
              value={dishData.servings}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
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
              className="w-full px-4 py-2 border rounded-md outline-orange-400 bg-slate-100"
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

        <label className="text-sm text-slate-400 ml-2">Spice Level</label>
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
              onClick={() => addGroup("toppings")}
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
              <div className="flex flex-col gap-3">
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

                <div className="flex items-center gap-6">
                  <div
                    role="radiogroup"
                    className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200"
                  >
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`toppings-mode-${groupIndex}`}
                        checked={group.mode === "included"}
                        onChange={() =>
                          handleModeChange("toppings", groupIndex, "included")
                        }
                        className="sr-only"
                      />
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          group.mode === "included"
                            ? "bg-slate-700 text-white shadow"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Fixed Price
                      </span>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`toppings-mode-${groupIndex}`}
                        checked={group.mode === "quantity"}
                        onChange={() =>
                          handleModeChange("toppings", groupIndex, "quantity")
                        }
                        className="sr-only"
                      />
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          group.mode === "quantity"
                            ? "bg-slate-700 text-white shadow"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Multiple Options
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-4 items-center">
                    {isIncludedGroup(group) ? (
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
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="i.e 1"
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
                      </>
                    )}
                  </div>
                ))}
              </div>

              {!isIncludedGroup(group) && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...dishData.toppings];
                    updated[groupIndex].options.push({
                      label: "",
                      price: "0.00",
                    });
                    setDishData((prev) => ({ ...prev, toppings: updated }));
                  }}
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  + Add Option
                </button>
              )}
            </div>
          ))}
        </section>

        <section className="space-y-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-orange-500">Extras</h2>
            <button
              type="button"
              onClick={() => addGroup("extras")}
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
              <div className="flex flex-col gap-3">
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

                <div className="flex items-center gap-6">
                  <div
                    role="radiogroup"
                    className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200"
                  >
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`extras-mode-${groupIndex}`}
                        checked={group.mode === "included"}
                        onChange={() =>
                          handleModeChange("extras", groupIndex, "included")
                        }
                        className="sr-only"
                      />
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          group.mode === "included"
                            ? "bg-slate-700 text-white shadow"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Fixed Price
                      </span>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`extras-mode-${groupIndex}`}
                        checked={group.mode === "quantity"}
                        onChange={() =>
                          handleModeChange("extras", groupIndex, "quantity")
                        }
                        className="sr-only"
                      />
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          group.mode === "quantity"
                            ? "bg-slate-700 text-white shadow"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Multiple Options
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-4 items-center">
                    {isIncludedGroup(group) ? (
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
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="i.e 1"
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
                      </>
                    )}
                  </div>
                ))}
              </div>

              {!isIncludedGroup(group) && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...dishData.extras];
                    updated[groupIndex].options.push({
                      label: "",
                      price: "0.00",
                    });
                    setDishData((prev) => ({ ...prev, extras: updated }));
                  }}
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  + Add Option
                </button>
              )}
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
