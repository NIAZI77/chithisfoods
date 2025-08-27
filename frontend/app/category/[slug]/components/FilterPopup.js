"use client";

import React, { useState, useEffect } from "react";
import { X, Star, Flame, DollarSign, Filter } from "lucide-react";
import Slider from "@/components/ui/slider";

const FilterPopup = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const spiceLevels = ["All", "Sweet", "Mild", "Medium", "Hot", "Sweet & Spicy"];
  const ratingOptions = [0, 1, 2, 3, 4, 5];

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleSpiceLevelChange = (level) => {
    if (level === "All") {
      setFilters((prev) => ({ ...prev, spiceLevel: "" }));
      return;
    }
    setFilters((prev) => ({
      ...prev,
      spiceLevel: prev.spiceLevel === level ? "" : level,
    }));
  };

  const handlePriceRangeChange = (range) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      rating: 0,
      spiceLevel: "",
      priceRange: [0, 1000],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-8 flex-grow overflow-y-auto hide-scrollbar">
          {/* Dish Rating */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-gray-700">
                Dish Rating
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                    filters.rating === rating
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent"
                  }`}
                >
                  {rating === 0 ? (
                    "Any"
                  ) : (
                    <>
                      {rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-700">
                Spice Level
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {spiceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleSpiceLevelChange(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    (level === "All" && filters.spiceLevel === "") || filters.spiceLevel === level
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-700">
                Price Range
              </h3>
            </div>
            <div className="space-y-4 pt-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={1000}
                step={1}
                className="w-full"
              />
              <p className="text-center text-sm text-gray-600">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-5 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={handleReset}
            className="flex-1 text-center block text-gray-600 px-4 py-3 rounded-full border-2 border-gray-600 hover:bg-gray-600 hover:text-white transition-all font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-rose-600 text-white px-4 py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup; 