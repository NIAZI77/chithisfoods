import React from 'react';

const DeliveryTypeBadge = ({ deliveryType, variant = "solid" }) => {
  // Treat "address" as "delivery"
  const type = deliveryType === "address" ? "delivery" : deliveryType;
  
  const getStyles = () => {
    if (type === "pickup") {
      return variant === "solid" 
        ? "bg-orange-500 text-white" 
        : "bg-orange-100 text-orange-800";
    } else if (type === "delivery") {
      return variant === "solid" 
        ? "bg-amber-500 text-white" 
        : "bg-amber-100 text-amber-800";
    }
    // Fallback for unknown types
    return variant === "solid" 
      ? "bg-gray-500 text-white" 
      : "bg-gray-100 text-gray-800";
  };

  const getDisplayText = () => {
    if (type === "pickup") return "Pickup";
    if (type === "delivery") return "Delivery";
    return deliveryType; // Fallback for unknown types
  };

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-20 ${getStyles()}`}>
      {getDisplayText()}
    </span>
  );
};

export default DeliveryTypeBadge;
