"use client";

import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

export default function ServiceAreaStep({ serviceArea, onServiceAreaChange }) {
  const [serviceAreaInput, setServiceAreaInput] = useState("");

  const handleServiceAreaAdd = () => {
    const trimmedValue = serviceAreaInput.trim();

    // Validate zipcode format (5 digits)
    const zipcodeRegex = /^\d{5}$/;
    if (!zipcodeRegex.test(trimmedValue)) {
      toast.error("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (trimmedValue && !serviceArea.includes(trimmedValue)) {
      onServiceAreaChange([...serviceArea, trimmedValue]);
      setServiceAreaInput("");
    } else if (serviceArea.includes(trimmedValue)) {
      toast.warning("This ZIP code has already been added");
    }
  };

  const handleServiceAreaRemove = (indexToRemove) => {
    onServiceAreaChange(serviceArea.filter((_, index) => index !== indexToRemove));
  };

  const handleServiceAreaKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleServiceAreaAdd();
    }
  };

  const handleServiceAreaInputChange = (e) => {
    // Only allow numbers and limit to 5 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setServiceAreaInput(value);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl my-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-rose-600" />
        Service Area
      </h2>
      <p className="text-gray-600 mb-6">
        Define the ZIP codes where you&apos;ll deliver your delicious food
      </p>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Service ZIP Codes</h3>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400 h-4 w-4" />
            <input
              type="text"
              value={serviceAreaInput}
              onChange={handleServiceAreaInputChange}
              onKeyPress={handleServiceAreaKeyPress}
              placeholder="Enter Zipcode"
              maxLength={5}
              className="flex-1 px-3 py-2 border rounded-full outline-rose-400 text-sm bg-slate-100 w-full text-center font-semibold tracking-widest h-10"
            />
          </div>
          <button
            type="button"
            onClick={handleServiceAreaAdd}
            disabled={serviceAreaInput.length !== 5 || serviceArea.includes(serviceAreaInput)}
            className="px-4 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed h-10"
          >
            <Plus className="w-4 h-4" />
            Add Zipcode
          </button>
        </div>
      </div>

      {/* ZIP Code Badges */}
      {serviceArea.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-semibold text-gray-700">
              Service ZIP Codes ({serviceArea.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {serviceArea.map((zipcode, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 rounded-full text-sm font-bold border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 w-26"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span className="tracking-widest">{zipcode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleServiceAreaRemove(index)}
                  className="hover:bg-rose-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {serviceArea.length === 0 && (
        <div className="text-center py-8">
          <div className="flex items-center bg-rose-100 rounded-full p-2 w-fit mx-auto mb-4">
            <MapPin className="w-14 h-14 text-rose-600" />
          </div>
          <p className="text-gray-500">
            No service areas added yet. Add your first ZIP code above to get started!
          </p>
        </div>
      )}
    </div>
  );
}
