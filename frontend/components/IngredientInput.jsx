"use client";

import React, { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const IngredientInput = ({ 
  value = [], 
  onChange, 
  placeholder = "Type ingredient and press Enter...",
  className = "",
  maxIngredients = 50 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleAddIngredient = useCallback((ingredient) => {
    if (!ingredient.trim()) return;
    
    const trimmedIngredient = ingredient.trim();
    
    // Check if ingredient already exists (case-insensitive)
    if (value.some(item => item.toLowerCase() === trimmedIngredient.toLowerCase())) {
      return;
    }
    
    // Check max ingredients limit
    if (value.length >= maxIngredients) {
      return;
    }
    
    const newIngredients = [...value, trimmedIngredient];
    onChange?.(newIngredients);
    setInputValue("");
  }, [value, onChange, maxIngredients]);

  const handleRemoveIngredient = useCallback((indexToRemove) => {
    const newIngredients = value.filter((_, index) => index !== indexToRemove);
    onChange?.(newIngredients);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      e.preventDefault();
      handleRemoveIngredient(value.length - 1);
    }
  }, [inputValue, value, handleAddIngredient, handleRemoveIngredient]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className={`${className}`}>
      {/* Input field with badges inside */}
      <div className="relative">
        <div 
          className={`w-full min-h-[42px] px-4 py-2 border rounded-md bg-slate-100 flex flex-wrap items-center gap-2 cursor-text transition-all duration-200 ${
            isFocused 
              ? 'border-orange-400 ring-2 ring-orange-400/20 bg-white' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Ingredients badges */}
          {value.map((ingredient, index) => (
            <Badge
              key={`${ingredient}-${index}`}
              variant="secondary"
              className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 transition-colors shadow-sm"
            >
              <span className="text-sm font-medium">{ingredient}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveIngredient(index);
                }}
                className="ml-1 rounded-full p-0.5 text-rose-600 border-2 border-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : "Type ingredient and press Enter..."}
            className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-sm placeholder:text-slate-400 text-slate-700"
            disabled={value.length >= maxIngredients}
          />
        </div>
      </div>
      
      {/* Helper text */}
      {value.length >= maxIngredients && (
        <p className="text-sm text-slate-500 mt-1 ml-2">
          Maximum {maxIngredients} ingredients reached
        </p>
      )}
    </div>
  );
};

export default IngredientInput;
