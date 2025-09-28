import { Filter, CircleDollarSign } from "lucide-react";

const EmptyState = ({
  title = "No orders requiring payment processing",
  subtitle = "Try adjusting your filters",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg border border-gray-200">
      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
        <CircleDollarSign className="w-6 h-6 text-emerald-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-500 text-sm text-center flex items-center gap-2">
        <Filter className="w-4 h-4" /> {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;


