"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";

export default function AddDishPage() {
  const router = useRouter();
  const [dishData, setDishData] = useState({
    name: "",
    description: "",
    price: "",
    chef: {},
    zipcode: "",
    email: "",
    image: { id: 0, url: "" },
    servings: "",
    category: "fruits",
    subcategory: "apple",
    preparation_time: "",
    vendorId: "",
    ingredients: "",
    toppings: [],
    extras: [],
    spiciness: [],
    reviews: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user) {
      getChefData(user);
    } else {
      toast.error("Please login to continue.");
      router.push("/login");
    }
  }, []);
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
          chef: {
            username: data.data[0].username,
            name: data.data[0].storeName,
            avatar: { id: data.data[0].id, url: data.data[0].avatar.url },
            rating: data.data[0].rating,
          },
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
      const payload = {
        ...dishData,
        price: parseFloat(dishData.price),
        servings: parseInt(dishData.servings),
        preparation_time: parseInt(dishData.preparation_time),
        ingredients: dishData.ingredients.split(",").map((item) => item.trim()),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: payload }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save dish");
      }

      toast.success("Dish saved successfully!");
      setTimeout(() => router.push("/vendor/manage-inventory"), 1000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              onValueChange={(value) =>
                setDishData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full bg-slate-100 rounded-md">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="cooked-food">Cooked Food</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="butter">Butter</SelectItem>
                  <SelectItem value="spice">Spice</SelectItem>
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
              onValueChange={(value) =>
                setDishData((prev) => ({ ...prev, subcategory: value }))
              }
            >
              <SelectTrigger className="w-full bg-slate-100 rounded-md">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>

                  <SelectLabel>Vegetables</SelectLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                  <SelectItem value="spinach">Spinach</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>

                  <SelectLabel>Cooked Food</SelectLabel>
                  <SelectItem value="pizza">Pizza</SelectItem>
                  <SelectItem value="pasta">Pasta</SelectItem>
                  <SelectItem value="burger">Burger</SelectItem>
                  <SelectItem value="sushi">Sushi</SelectItem>

                  <SelectLabel>Fish</SelectLabel>
                  <SelectItem value="salmon">Salmon</SelectItem>
                  <SelectItem value="tuna">Tuna</SelectItem>
                  <SelectItem value="cod">Cod</SelectItem>

                  <SelectLabel>Butter</SelectLabel>
                  <SelectItem value="butter_cream">Butter Cream</SelectItem>
                  <SelectItem value="butter_sauce">Butter Sauce</SelectItem>

                  <SelectLabel>Spice</SelectLabel>
                  <SelectItem value="turmeric">Turmeric</SelectItem>
                  <SelectItem value="cumin">Cumin</SelectItem>
                  <SelectItem value="paprika">Paprika</SelectItem>
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
            className="w-full h-32 resize-none px-4 py-2 border rounded-md my-2 outline-orange-400 bg-slate-100"
          />
        </div>

        <div className="flex items-center justify-between mt-2 flex-wrap space-y-2">
          {["Sweet", "Mild", "Medium", "Hot", "Sweet & Spicy"].map((level) => (
            <div
              key={level}
              onClick={() => handleSpicinessChange(level)}
              className={`w-32 text-center cursor-pointer p-3 border-2 rounded-md mx-2 text-xs font-semibold transition-all ${
                dishData.spiciness.includes(level)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {level}
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            Toppings
          </h2>
          <button
            type="button"
            onClick={() => addOptionGroup("toppings")}
            className="mb-4 flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Topping
          </button>
          {dishData.toppings.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="p-4 rounded-lg mb-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
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
                  className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
                />
                <button
                  type="button"
                  onClick={() => deleteOptionGroup("toppings", groupIndex)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
              {group.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2 items-center">
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
                    className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
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
                    className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updated = [...dishData.toppings];
                  updated[groupIndex].options.push({ label: "", price: "" });
                  setDishData((prev) => ({ ...prev, toppings: updated }));
                }}
                className="text-sm text-orange-500 mt-2"
              >
                + Add Option
              </button>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold text-orange-500 mb-2">Extras</h2>
          <button
            type="button"
            onClick={() => addOptionGroup("extras")}
            className="mb-4 flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Extra
          </button>
          {dishData.extras.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="p-4 rounded-lg mb-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
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
                  className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
                />
                <button
                  type="button"
                  onClick={() => deleteOptionGroup("extras", groupIndex)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
              {group.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2 items-center">
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
                    className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
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
                    className="w-full md:px-4 md:py-2 px-2 py-1 border rounded-full my-2 outline-orange-400"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updated = [...dishData.extras];
                  updated[groupIndex].options.push({ label: "", price: "" });
                  setDishData((prev) => ({ ...prev, extras: updated }));
                }}
                className="text-sm text-orange-500 mt-2"
              >
                + Add Option
              </button>
            </div>
          ))}
        </section>

        <button
          className="bg-orange-600 text-white py-3 rounded-full shadow-orange-300 shadow-md hover:bg-orange-700 transition-all w-full mt-8 disabled:bg-orange-400 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Dish"}
        </button>
      </form>
    </div>
  );
}
