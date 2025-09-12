"use client";

import React, { useState } from "react";
import { Plus, X, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const ServiceAreaInput = ({ 
  value = [], 
  onChange, 
  placeholder = "Enter Zipcode",
  className = "",
  disabled = false,
  title = "Service Area",
  description = "Define the ZIP codes where you'll deliver your delicious food"
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();

    // Validate zipcode format (5 digits)
    const zipcodeRegex = /^\d{5}$/;
    if (!zipcodeRegex.test(trimmedValue)) {
      toast.error("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (trimmedValue && !value.includes(trimmedValue)) {
      const newValue = [...value, trimmedValue];
      onChange(newValue);
      setInputValue("");
    } else if (value.includes(trimmedValue)) {
      toast.warning("This ZIP code has already been added");
    }
  };

  const handleRemove = (indexToRemove) => {
    const newValue = value.filter((_, index) => index !== indexToRemove);
    onChange(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleInputChange = (e) => {
    // Only allow numbers and limit to 5 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setInputValue(value);
  };

  return (
    <div className={className}>
      <p className="text-gray-600 mb-6">
        {description}
      </p>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Service ZIP Codes</h3>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              maxLength={5}
              disabled={disabled}
              className="flex-1 px-3 py-2 border rounded-full outline-orange-400 text-sm bg-slate-100 w-full text-center font-semibold tracking-widest h-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || inputValue.length !== 5 || value.includes(inputValue)}
            className="px-4 py-2 bg-orange-600 text-white rounded-full shadow-orange-300 shadow-md hover:bg-orange-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed h-10"
          >
            <Plus className="w-4 h-4" />
            Add Zipcode
          </button>
        </div>
      </div>

      {/* ZIP Code Badges */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">
              Service ZIP Codes ({value.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {value.map((zipcode, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-bold border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 w-26"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span className="tracking-widest">{zipcode}</span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && (
        <div className="text-center py-8">
          <div className="flex items-center bg-orange-100 rounded-full p-2 w-fit mx-auto mb-4">
            <MapPin className="w-14 h-14 text-orange-600" />
          </div>
          <p className="text-gray-500">
            No service areas added yet. Add your first ZIP code above to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaInput;
