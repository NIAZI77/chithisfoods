import React from 'react';
import { Truck, ShoppingBag } from 'lucide-react';

const AddressModeSelector = ({ selectedMode, onModeChange }) => {
  const modes = [
    {
      id: 'delivery',
      label: 'Delivery',
      description: 'Deliver to your address',
      icon: Truck,
      color: 'rose'
    },
    {
      id: 'pickup',
      label: 'Pickup',
      description: 'Collect from restaurant',
      icon: ShoppingBag,
      color: 'green'
    }
  ];

  const getBorderColor = (mode, isSelected) => {
    if (!isSelected) return 'border-gray-200 hover:border-gray-300 hover:shadow-sm';
    
    switch (mode.color) {
      case 'rose':
        return 'border-rose-500 bg-rose-50 shadow-md';
      case 'green':
        return 'border-green-500 bg-green-50 shadow-md';
      default:
        return 'border-rose-500 bg-rose-50 shadow-md';
    }
  };

  const getRadioColor = (mode, isSelected) => {
    if (!isSelected) return 'border-gray-300';
    
    switch (mode.color) {
      case 'rose':
        return 'border-rose-500 bg-rose-500';
      case 'green':
        return 'border-green-500 bg-green-500';
      default:
        return 'border-rose-500 bg-rose-500';
    }
  };

  const getIconColor = (mode) => {
    switch (mode.color) {
      case 'rose':
        return 'text-rose-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-rose-600';
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="font-black text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-black flex items-center gap-2">
        <Truck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> Delivery Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <div
              key={mode.id}
              className={`relative border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 cursor-pointer transition-all duration-200 ${getBorderColor(mode, isSelected)}`}
              onClick={() => onModeChange(mode.id)}
            >
              <input
                type="radio"
                name="deliveryMode"
                id={mode.id}
                value={mode.id}
                checked={isSelected}
                onChange={() => onModeChange(mode.id)}
                className="sr-only"
              />
              <label
                htmlFor={mode.id}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getRadioColor(mode, isSelected)}`}>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0 ${getIconColor(mode)}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">{mode.label}</div>
                    <div className="text-xs sm:text-sm text-gray-600 leading-tight">{mode.description}</div>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressModeSelector;


