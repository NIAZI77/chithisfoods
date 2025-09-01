import React from "react";
import { MapPin, Phone, Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import Spinner from "../../components/Spinner";

const SavedAddressesList = ({
  savedAddresses,
  selectedAddressId,
  onAddressSelection,
  onEditAddress,
  onDeleteAddress,
  onRefreshAddresses,
  onAddNewAddress,
  addressesLoading,
  showAddNewButton = true,
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex gap-2">
          {showAddNewButton && (
            <button
              type="button"
              onClick={onAddNewAddress}
              className="px-3 sm:px-4 py-1 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
          <button
            type="button"
            onClick={onRefreshAddresses}
            disabled={addressesLoading}
            className="px-3 sm:px-4 py-1 bg-slate-600 text-white rounded-full shadow-slate-300 shadow-md hover:bg-slate-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {addressesLoading ? <Spinner /> : <RefreshCw className="w-4 h-4" />}
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {addressesLoading ? (
        <div className="text-center py-6 sm:py-8">
          <div className="inline-flex items-center">
            <Spinner />
          </div>
        </div>
      ) : (savedAddresses || []).length > 0 ? (
        <div className="space-y-3">
          {(savedAddresses || []).map((address) => (
            <div
              key={address.id}
              className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm ${
                selectedAddressId === address.id
                  ? "border-rose-500 bg-rose-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onAddressSelection(address.id)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                    selectedAddressId === address.id
                      ? "border-rose-500 bg-rose-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-900 mb-1 text-sm sm:text-base">
                    {address.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    {address.phone}
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-800">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed break-words">
                      {address.address}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address);
                    }}
                    className="p-1.5 sm:p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                    title="Edit address"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(address.id);
                    }}
                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="inline-flex flex-col items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            <div className="text-center">
              <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
                No saved addresses
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {showAddNewButton
                  ? "Click 'Add New' to save your first address."
                  : "Enter your address below and click Save to save it for future use."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddressesList;
