import React from "react";
import { Truck, ShoppingBag } from "lucide-react";

const AddressModeSelector = ({ selectedMode, onModeChange }) => {
  const isDeliverySelected = selectedMode === "delivery";
  const isPickupSelected = selectedMode === "pickup";

  const getBorderColor = (isSelected, color) => {
    if (!isSelected)
      return "border-gray-200 hover:border-gray-300 hover:shadow-sm";

    switch (color) {
      case "rose":
        return "border-rose-500 bg-rose-50 shadow-md";
      case "green":
        return "border-green-500 bg-green-50 shadow-md";
      default:
        return "border-rose-500 bg-rose-50 shadow-md";
    }
  };

  const getRadioColor = (isSelected, color) => {
    if (!isSelected) return "border-gray-300";

    switch (color) {
      case "rose":
        return "border-rose-500 bg-rose-500";
      case "green":
        return "border-green-500 bg-green-500";
      default:
        return "border-rose-500 bg-rose-500";
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case "rose":
        return "text-rose-600";
      case "green":
        return "text-green-600";
      default:
        return "text-rose-600";
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="font-black text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-black flex items-center gap-2">
        <Truck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> Delivery
        Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        {/* Delivery Option */}
        <div
          className={`relative border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 cursor-pointer transition-all duration-200 ${getBorderColor(
            isDeliverySelected,
            "rose"
          )}`}
          onClick={() => onModeChange("delivery")}
        >
          <input
            type="radio"
            name="deliveryMode"
            id="delivery"
            value="delivery"
            checked={isDeliverySelected}
            onChange={() => onModeChange("delivery")}
            className="sr-only"
          />
          <label
            htmlFor="delivery"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          >
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getRadioColor(
                isDeliverySelected,
                "rose"
              )}`}
            >
              {isDeliverySelected && (
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Truck
                className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0 ${getIconColor(
                  "rose"
                )}`}
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  Delivery
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Pickup Option */}
        <div
          className={`relative border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 cursor-pointer transition-all duration-200 ${getBorderColor(
            isPickupSelected,
            "green"
          )}`}
          onClick={() => onModeChange("pickup")}
        >
          <input
            type="radio"
            name="deliveryMode"
            id="pickup"
            value="pickup"
            checked={isPickupSelected}
            onChange={() => onModeChange("pickup")}
            className="sr-only"
          />
          <label
            htmlFor="pickup"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          >
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getRadioColor(
                isPickupSelected,
                "green"
              )}`}
            >
              {isPickupSelected && (
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <ShoppingBag
                className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0 ${getIconColor(
                  "green"
                )}`}
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  Pickup
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddressModeSelector;
