import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const VendorCard = ({ vendor }) => {
  const [coverImage, setCoverImage] = useState(
    vendor?.coverImage?.url || "/fallback.png"
  );
  const [logoImg, setLogoImg] = useState(
    vendor?.logo?.url || "/fallback-logo.png"
  );

  const capitalizeWords = (text) =>
    text?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";
  function getAvailability(vendor) {
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

    for (let dish of vendor.menu) {
      if (dish.available_days?.includes(today)) {
        return "Today"; // Return "Today" if available today
      }
    }

    // Find the next available day
    for (let i = 1; i <= 7; i++) {
      const nextDay = daysOfWeek[(daysOfWeek.indexOf(today) + i) % 7];
      for (let dish of vendor.menu) {
        if (dish.available_days?.includes(nextDay)) {
          return fullDayNames[nextDay]; // Return full name of the next available day
        }
      }
    }
    return "No Availability";
  }
  return (
    <Link
      title={vendor.name || process.env.NEXT_PUBLIC_NAME}
      href={`/vendors/${vendor?.documentId}`}
      className="p-2"
    >
      <div className="max-w-72 w-72 h-72 overflow-hidden bg-slate-50 rounded-md p-4 relative shadow-md transition hover:shadow-lg">
        {vendor?.isTopRated && (
          <div
            className="w-32 h-6 bg-pink-600 px-3 font-bold text-white text-sm flex items-center absolute top-5 left-5 rounded-r-md"
            style={{
              clipPath: "polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 0 0)",
            }}
          >
            Top Rated
          </div>
        )}

        <div className="mb-4">
          <Image
            src={coverImage}
            alt={`${vendor?.name || "Vendor"} Cover Image`}
            width={300}
            height={100}
            className="w-full h-28 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setCoverImage("/fallback.png");
            }}
          />
        </div>

        <div className="flex items-center">
          <Image
            src={logoImg}
            alt={`${vendor?.name || "Vendor"} Logo`}
            width={50}
            height={50}
            className="w-14 h-14 rounded-full object-cover mr-4"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setLogoImg("/fallback-logo.png");
            }}
          />
          <div>
            <h2 className="text-lg font-bold select-text">
              {capitalizeWords(vendor?.name)}
            </h2>
            <p className="text-sm text-gray-500">
              {capitalizeWords(vendor?.location?.city)} ·{" "}
              {capitalizeWords(vendor?.location?.state)}
              <br />
              {capitalizeWords(vendor?.location?.country)}
            </p>
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400" />
              <p className="text-yellow-500 font-semibold space-x-1">
                <span>{vendor?.rating || 0}</span>
                <span>
                  (
                  {vendor.menu.reduce(
                    (total, dish) => total + dish.reviews.length,
                    0
                  ) || 0}
                  )
                </span>
              </p>
            </div>
            <div className="flex items-center font-bold pt-2 text-red-700">
              <MdOutlineDateRange className="mr-2 scale-125" />
              {getAvailability(vendor)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
