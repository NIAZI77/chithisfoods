import { Calculator, TrendingUp } from "lucide-react";

const TaxMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Tax Collected</p>
            <h3 className="text-2xl font-semibold">
              ${metrics.totalTax.toFixed(2)}
            </h3>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Calculator className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Tax from Delivered Orders</p>
            <h3 className="text-2xl font-semibold">
              ${metrics.deliveredOrdersTax.toFixed(2)}
            </h3>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxMetrics;
