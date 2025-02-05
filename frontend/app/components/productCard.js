import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const ProductCard = ({ product, logo, location, documentId }) => {
  const [productImg, setProductImg] = useState(
    product?.image?.url || "/fallback.png"
  );
  const [logoImg, setLogoImg] = useState(logo?.url || "/fallback-logo.png");

  function getNextAvailableDay(availableDays = []) {
    if (!availableDays.length) return "No Availability";

    const today = new Date().toLocaleString("en-us", { weekday: "short" });
    const fullDayNames = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (availableDays.includes(today)) return fullDayNames[today];

    for (let i = 1; i <= 7; i++) {
      const nextDay = daysOfWeek[(daysOfWeek.indexOf(today) + i) % 7];
      if (availableDays.includes(nextDay)) return fullDayNames[nextDay];
    }
  }

  return (
    <Link
      title={product.name || process.env.NEXT_PUBLIC_NAME}
      href={`/product/${documentId}?productId=${product?.id}`}
      className="content-center w-fit"
    >
      <div className="max-w-72 w-72 h-80 mx-auto overflow-hidden bg-slate-50 rounded-md p-4 relative shadow-md transition hover:shadow-lg">
        {product?.dish_availability === "Unavailable" && (
          <div className="bg-rose-600 px-2 py-1 rounded-full absolute top-4 left-4 font-bold text-white text-xs">
            Unavailable Now
          </div>
        )}

        <div className="mb-4">
          <Image
            src={productImg}
            alt={product?.name || "Product Image"}
            width={256}
            height={128}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setProductImg("/fallback.png");
            }}
          />
        </div>

        <div className="flex items-center">
          <Image
            src={logoImg}
            alt={`${product?.vendor?.name || "Profile"} logo`}
            width={50}
            height={50}
            className="w-14 h-14 rounded-full object-cover mr-4"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setLogoImg("/fallback-logo.png");
            }}
          />
          <div className="w-[70%]">
            <h2 className="text-md font-bold capitalize select-text">
              {product?.name?.length > 15
                ? (product?.name?.slice(0, 12) + "...").replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )
                : product?.name?.replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>
            <div className="text-sm font-semibold text-gray-500">
              {product?.vegetarian ? "Vegetarian Dish" : "Non-Vegetarian Dish"}
            </div>
            <div className="flex items-center justify-end py-2">
              <div className="inline-flex items-center justify-end text-slate-500 px-2 bg-gray-200 rounded-lg font-bold">
                Servings{" "}
                {product?.serving > 1
                  ? `1-${product?.serving}`
                  : product?.serving || "N/A"}
              </div>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="font-semibold text-lg text-gray-700">
                ${product?.price || "0.00"}
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <p className="text-yellow-500 font-semibold">
                  {product?.rating || 0} ({product?.reviews?.length || 0})
                </p>
              </div>
            </div>
            <div className="flex items-center font-bold pt-2 text-red-700">
              <MdOutlineDateRange className="mr-2 scale-125" />
              {getNextAvailableDay(product?.available_days)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
