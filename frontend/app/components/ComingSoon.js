import { Clock, MapPin, ChefHat, Sparkles, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function ComingSoon({ zipcode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[60vh]">
      <div
        className={`text-center max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Floating Sparkles with More Animation */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 animate-bounce delay-500">
            <Sparkles className="w-6 h-6 text-rose-300" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce delay-1000">
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce delay-1500">
            <Sparkles className="w-5 h-5 text-rose-300" />
          </div>
          <div className="absolute top-1/2 -left-8 animate-pulse delay-2000">
            <Sparkles className="w-3 h-3 text-pink-300" />
          </div>
          <div className="absolute top-1/2 -right-8 animate-pulse delay-2500">
            <Sparkles className="w-3 h-3 text-pink-300" />
          </div>
        </div>

        {/* Main Icon with Enhanced Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-pulse">
              <ChefHat className="w-14 h-14 text-rose-600 group-hover:text-rose-700 transition-colors duration-300" />
            </div>
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-md animate-bounce delay-300">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {/* Rotating ring effect */}
            <div className="absolute inset-0 rounded-full border-2 border-rose-200 animate-spin duration-10000"></div>
          </div>
        </div>

        {/* Enhanced Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
          Coming Soon to Your Area!
        </h2>

        {/* Location with Enhanced Design */}
        {zipcode && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-xl font-semibold text-rose-700 bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-3 rounded-full border border-rose-200 shadow-sm">
              <MapPin className="w-6 h-6 text-rose-600 inline-block mr-2" />
              {zipcode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
