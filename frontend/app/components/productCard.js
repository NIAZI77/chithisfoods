import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
const ProductCard = ({ product, logo, location, documentId }) => {
  function getNextAvailableDay(availableDays) {
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

    // Check if today is available
    if (availableDays.includes(today)) {
      return fullDayNames[today]; // If today is available, return today
    }

    // Otherwise, find the next available day
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (daysOfWeek.indexOf(today) + i) % 7;
      const nextDay = daysOfWeek[nextDayIndex];
      if (availableDays.includes(nextDay)) {
        return fullDayNames[nextDay]; 
      }
    }
  }

  return (
    <Link href={`/product/${documentId}?productId=${product.id}`} passHref>
      <div className="m-4 max-w-72 w-72 h-80 max-h-80 overflow-hidden bg-slate-50 rounded-md p-4 relative">
        <div>
          {product.dish_availability == "Unavailable" && (
            <div className="bg-red-600 inline-block mx-auto px-2 py-1 rounded absolute top-6 left-5 font-bold text-white text-xs">
              Not Available
            </div>
          )}
        </div>

        <div className="mb-4">
          <img
            height={100}
            width={100}
            src={product.image.url}
            alt={`${product.name}`}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
        </div>

        <div className="flex items-center">
          <Image
            height={50}
            width={50}
            src={logo.url}
            alt={`${product.name} profile`}
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div className="w-[70%]">
            <h2 className="text-md font-bold select-text">
              {product.name
                .split(" ")
                .map(
                  (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                )
                .join(" ")}
            </h2>
            <div>
              {product.vegetarian ? (
                <div className="font-bold text-sm text-slate-500">
                  Vegetarian Dish
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-500">
                  Non-Vegetarian Dish
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-500">
                Serving Size
              </span>
              <span className="">{product.serving}</span>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="font-semibold text-lg text-slate-700">
                ${product.price}
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <p className="text-yellow-500 font-semibold">
                  {product.rating || 0}({product.reviews.length || 0})
                </p>
              </div>
            </div>
            <div className="flex items-center justify-start font-bold pt-2 text-red-700">
              <MdOutlineDateRange className="inline mr-2 scale-125" />{" "}
              {getNextAvailableDay(product.available_days)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
