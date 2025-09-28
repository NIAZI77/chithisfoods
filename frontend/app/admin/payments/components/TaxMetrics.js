import { TrendingUp } from "lucide-react";

const TaxMetrics = ({ metrics }) => {
  return (
    <div className="mb-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total tax collected</p>
            <h3 className="text-xl font-semibold">
              ${metrics.deliveredOrdersTax.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-full">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxMetrics;
