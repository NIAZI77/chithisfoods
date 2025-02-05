"use client";
import { useState } from "react";

const TopRatedChefsToggle = ({ setIsTopRated }) => {
  const [isOn, setIsOnInput] = useState(false);

  const handleToggle = () => {
    setIsOnInput(!isOn);
    setIsTopRated(!isOn);
  };

  return (
    <div className="flex items-center justify-end">
        <div className="flex items-center justify-between bg-gray-200 p-1 rounded-full w-48">
        <span className="font-bold text-xs px-2">Top Rated Shefs</span>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 flex items-center p-0.5 rounded-full transition-all shadow-md ${
            isOn ? "bg-emerald-500" : "bg-rose-500"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white ${
              isOn ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {isOn ? (
              <div className="w-3 h-3 border-2 border-black rounded-full"></div>
            ) : (
              <div className="w-3 h-0.5 bg-black"></div>
            )}
          </span>
        </button>
      </div>

    </div>
  );
};

export default TopRatedChefsToggle;
