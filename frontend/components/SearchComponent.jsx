import React from "react";
import { Search } from "lucide-react";

const SearchComponent = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit, 
  placeholder = "Search...",
  buttonColor = "bg-rose-600 hover:bg-rose-700",
  shadowColor = "shadow-rose-300"
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm">
      <div className="relative flex items-center flex-1">
        <input
          type="search"
          name="search"
          id="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-gray-100 pl-10 pr-4 py-2 rounded-l-full border-none outline-none w-full text-sm"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3" />
      </div>
      <button
        type="submit"
        className={`${buttonColor} text-white px-3 py-2 rounded-r-full ${shadowColor} shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchComponent;
