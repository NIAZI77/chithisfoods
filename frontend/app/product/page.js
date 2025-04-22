"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { FaStar, FaUser } from "react-icons/fa";
import { Timer } from "lucide-react";

const baseProduct = {
  name: "Spicy Chicken Biryani",
  image: "/baryani.jpeg",
  price: 9.99,
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
  extras: [
    {
      name: "Extra Chicken Piece",
      options: [
        { label: "1 Piece", price: 2 },
        { label: "2 Pieces", price: 3.5 },
      ],
    },
    {
      name: "Extra Cheese",
      options: [
        { label: "cheese", price: 2 },
      ],
    },
  ],
  toppings: [
    {
      name: "Raita",
      options: [{ label: "Included", price: 1.5 }],
    },
  ],
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [product, setProduct] = useState(baseProduct);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});

  useEffect(() => {
    const productWithNoneOptions = {
      ...baseProduct,
      extras: baseProduct.extras.map((extra) => ({
        ...extra,
        options: [{ label: "None", price: 0 }, ...extra.options],
      })),
      toppings: baseProduct.toppings.map((topping) => ({
        ...topping,
        options: [{ label: "None", price: 0 }, ...topping.options],
      })),
    };
    setProduct(productWithNoneOptions);

    const defaultExtras = {};
    productWithNoneOptions.extras.forEach((extra) => {
      defaultExtras[extra.name] = 0;
    });

    const defaultToppings = {};
    productWithNoneOptions.toppings.forEach((topping) => {
      defaultToppings[topping.name] = 0;
    });

    setSelectedExtras(defaultExtras);
    setSelectedToppings(defaultToppings);
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`inline w-4 h-4 ${
          i < Math.round(rating) ? "text-yellow-400" : "text-slate-400"
        }`}
      />
    ));

  const getTotalPrice = () => {
    const extrasPrice = Object.values(selectedExtras).reduce(
      (sum, price) => sum + price,
      0
    );
    const toppingsPrice = Object.values(selectedToppings).reduce(
      (sum, price) => sum + price,
      0
    );
    return (product.price + extrasPrice + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const extras = Object.entries(selectedExtras)
      .filter(([, price]) => price > 0)
      .map(([name, price]) => ({ name, price }));

    const toppings = Object.entries(selectedToppings)
      .filter(([, price]) => price > 0)
      .map(([name, price]) => ({ name, price }));

    const cartItem = {
      name: product.name,
      image: product.image,
      basePrice: product.price,
      chef: product.chef,
      quantity,
      extras,
      toppings,
      total: getTotalPrice().toFixed(2),
    };

    console.log("Added to cart:", cartItem);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
        <div>
          <Image
            src={product.image}
            width={400}
            height={300}
            alt={product.name}
            className="rounded-xl w-full object-cover aspect-video"
          />
        </div>

        <div className="space-y-4 p-4 h-fit">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="text-2xl font-bold text-red-600">
              ${getTotalPrice().toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 text-sm text-gray-500">
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
            <div className="bg-slate-200 rounded px-2 py-1 flex items-center gap-1">
              <span className="font-bold flex items-center gap-1">
                Servings <FaUser />
              </span>{" "}
              {product.servings}
            </div>
          </div>

         

          {product.toppings.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between">
                <h3>Toppings</h3>
                <p className="text-gray-400">Additonal Charges Apply</p>
              </div>

              {product.toppings.map((topping, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-800">{topping.name}</span>
                  <div className="flex gap-2">
                    {topping.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedToppings((prev) => ({
                            ...prev,
                            [topping.name]: option.price,
                          }))
                        }
                        className={`px-4 py-1 rounded-full border text-xs font-medium transition-all
                          ${
                            selectedToppings[topping.name] === option.price
                              ? "bg-red-500 text-white"
                              : "bg-white text-red-500 border-red-500"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {product.extras.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between">
                <h3>Extras</h3>
                <p className="text-gray-400">Additonal Charges Apply</p>
              </div>

              {product.extras.map((extra, index) => (
                <div key={index} className="flex justify-between items-center flex-wrap">
                  <span className="text-gray-800">{extra.name}</span>
                  <div className="flex gap-y-4 gap-x-2 flex-wrap">
                    {extra.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedExtras((prev) => ({
                            ...prev,
                            [extra.name]: option.price,
                          }))
                        }
                        className={`px-4 py-1 rounded-full border text-xs font-medium transition-all
                          ${
                            selectedExtras[extra.name] === option.price
                              ? "bg-red-500 text-white"
                              : "bg-white text-red-500 border-red-500"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
           <div className="gap-2 my-8">
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
            <button
              onClick={handleAddToCart}
              className="w-full bg-rose-600 text-white py-2 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-6 border-b pb-2">
          {["ingredients", "description", "reviews"].map((tab) => (
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
                : tab === "description"
                ? "Description"
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

        {activeTab === "description" && (
          <div className="text-sm text-gray-600 mt-6">
            <p>{product.description}</p>
            <div className="flex items-center justify-start gap-x-4 mt-4">
              <h2 className="font-bold text-lg flex items-center gap-x-1">
                <Timer /> Preparation Time
              </h2>
              <p>{product.preparation_time} minutes</p>
            </div>
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
