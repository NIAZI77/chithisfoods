"use client";
import Image from "next/image";
import { useState } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { Timer } from "lucide-react";

const product = {
  name: "Spicy Chicken Biryani",
  image: "/baryani.jpeg",
  price: 14.99,
  rating: 4.5,
  reviewsCount: 2,
  servings: 2,
  category: "Main Course",
  subcategory: "Rice Dishes",
  preparation_time: 30,

  description:
    "Aromatic basmati rice cooked with tender chicken, Indian spices, and herbs. Served with raita and salad.",
  chef: {
    vendorID: "cuyfsjkiu569fyvtj",
    name: "Ali Raza",
    avatar: "/person.jpeg",
    rating: 4.9,
  },
  ingredients: [
    "Basmati Rice",
    "Chicken",
    "Yogurt",
    "Spices",
    "Onions",
    "Mint",
  ],
  nutrition: {
    calories: "560 kcal",
    fat: "18g",
    protein: "35g",
    carbs: "60g",
  },
  reviews: [
    {
      name: "Emily R.",
      rating: 5,
      text: "Absolutely delicious! Perfect spice level and portion size.",
    },
    {
      name: "Jason M.",
      rating: 4,
      text: "Great flavor, but could use a bit more chicken.",
    },
  ],
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("ingredients");

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`inline w-4 h-4 ${
          i < Math.round(rating) ? "text-yellow-400" : "text-slate-400"
        }`}
      />
    ));

  return (
    <div className="min-h-screen bg-white text-gray-800 w-[90%] mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
        <div>
          <Image
            src={product.image}
            width={400}
            height={300}
            alt={product.name}
            className="rounded-xl w-full object-cover aspect-video"
          />
          <div className="text-sm text-gray-600 mt-8">
            <div>
              <h2 className="font-bold text-lg">Description</h2>
              <p>{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <h2 className="font-bold text-lg flex items-center justify-center gap-x-1">
              <Timer /> Preparation Time
              </h2>
              <p>{product.preparation_time} minutes</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              {product.category} |{" "}
              <span className="text-green-500 font-bold">
                {product.subcategory}
              </span>
            </div>
            <div className="flex items-center text-yellow-400">
              <FaStar /> {product.rating}
              <span className="text-gray-600 text-sm">
                ({product.reviewsCount})
              </span>
            </div>
            <div className="bg-slate-200 rounded px-2 py-1">
              <span className="font-bold">Servings</span> {product.servings}
            </div>
          </div>

          <div className="text-2xl font-bold text-red-600">
            ${product.price}
          </div>

          <div className="gap-2">
            <div className="text-sm text-rose-500 font-bold mb-2">
              Prepared by
            </div>
            <div className="flex items-center gap-4">
              <Image
                src={product.chef.avatar}
                alt={product.chef.name}
                width={48}
                height={48}
                className="rounded-full w-12 h-12 object-cover"
              />
              <span className="text-sm font-semibold">{product.chef.name}</span>
              <div className="text-sm text-yellow-400 flex items-center gap-1">
                <FaStar />
                {product.chef.rating}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-rose-500 text-white rounded-full flex items-center gap-2 p-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="hover:bg-rose-400 rounded-full p-1"
              >
                <LuMinus size={16} />
              </button>
              <span className="w-7 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="hover:bg-rose-400 rounded-full p-1"
              >
                <LuPlus size={16} />
              </button>
            </div>
            <button className="w-full bg-rose-600 text-white py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold">
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-6 border-b pb-2">
          {["ingredients", "nutrition", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 border-b-2 ${
                activeTab === tab
                  ? "text-red-600 border-red-600 font-semibold"
                  : "text-gray-500 border-transparent"
              }`}
            >
              {tab === "ingredients"
                ? "Ingredients"
                : tab === "nutrition"
                ? "Nutritional information"
                : "Ratings & reviews"}
            </button>
          ))}
        </div>

        {activeTab === "ingredients" && (
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            {product.ingredients.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 border bg-slate-50 rounded-lg w-24 h-24"
              >
                <Image src="/a.png" width={30} height={30} alt={item} />
                <span className="mt-2 text-sm font-medium text-center">
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="mt-6 space-y-2">
            <p>
              <strong>Calories:</strong> {product.nutrition.calories}
            </p>
            <p>
              <strong>Fat:</strong> {product.nutrition.fat}
            </p>
            <p>
              <strong>Protein:</strong> {product.nutrition.protein}
            </p>
            <p>
              <strong>Carbs:</strong> {product.nutrition.carbs}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <p className="text-sm font-semibold">{review.name}</p>
                <div className="flex gap-1 mt-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm mt-2">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
