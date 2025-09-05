import React, { useState } from "react";
import { MapPin, Plus, ChevronDown, ChevronUp } from "lucide-react";
import SavedAddressesList from "./SavedAddressesList";
import DeliveryForm from "./DeliveryForm";

const DeliveryAddressSelector = ({
  formData,
  onFormChange,
  savedAddresses,
  selectedAddressId,
  onAddressSelection,
  onEditAddress,
  onDeleteAddress,
  onRefreshAddresses,
  onAddNewAddress,
  addressesLoading,
  onSaveAddress,
  onUpdateAddress,
  onCancelEdit,
  editingAddress,
  savingAddress,
  showAddressForm,
  setShowAddressForm,
  onAddressSelect,
  onMarkerDrag,
  googleMapsLoaded,
  showMap,
  mapAddressData,
  canSaveAddress,
  isDuplicateAddress,
  addressHasChanged,
}) => {
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;
  const addressCount = savedAddresses ? savedAddresses.length : 0;

  // Only make form red when actively editing, not on initial load
  const isFormRed = editingAddress;

  // Function to scroll to delivery address section
  const scrollToDeliveryAddress = () => {
    const element = document.getElementById("delivery-address");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash
      window.location.hash = "delivery-address";
    }
  };

  // Enhanced add new address function that scrolls to delivery address
  const handleAddNewAddress = () => {
    onAddNewAddress();
    scrollToDeliveryAddress();
  };

  // Auto-scroll to delivery address if hash is present in URL
  React.useEffect(() => {
    if (window.location.hash === "#delivery-address") {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        scrollToDeliveryAddress();
      }, 100);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Saved Addresses Section - Always Visible */}
      <div className="border-2 border-gray-200 rounded-xl p-4">
        <button
          type="button"
          onClick={() => setShowSavedAddresses(!showSavedAddresses)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <span className="font-semibold text-gray-900">
              Saved Addresses ({addressCount})
            </span>
          </div>
          {showSavedAddresses ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showSavedAddresses && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {hasSavedAddresses ? (
              <SavedAddressesList
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                onAddressSelection={onAddressSelection}
                onEditAddress={onEditAddress}
                onDeleteAddress={onDeleteAddress}
                onRefreshAddresses={onRefreshAddresses}
                onAddNewAddress={handleAddNewAddress}
                addressesLoading={addressesLoading}
                showAddNewButton={true}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">
                  No saved addresses yet. Add your first address below!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address Form Section - Always Visible */}
      <div
        id="delivery-address"
        className="border-2 border-gray-200 rounded-xl p-4"
      >
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-600" />
            {editingAddress ? "Edit Address" : "Delivery Address"}
          </h4>
        </div>

        {/* Always show the form with transparent background by default */}
        <div
          className={`rounded-xl p-4 ${
            isFormRed
              ? "border-2 border-dashed border-slate-300 bg-slate-50"
              : ""
          }`}
        >
          <DeliveryForm
            formData={formData}
            onFormChange={onFormChange}
            onSaveAddress={onSaveAddress}
            onUpdateAddress={onUpdateAddress}
            onCancelEdit={onCancelEdit}
            editingAddress={editingAddress}
            savingAddress={savingAddress}
            selectedAddressId={selectedAddressId}
            showSaveButton={isFormRed || !selectedAddressId} // Show save button when editing or no address selected
            onAddressSelect={onAddressSelect}
            onMarkerDrag={onMarkerDrag}
            googleMapsLoaded={googleMapsLoaded}
            showMap={showMap}
            mapAddressData={mapAddressData}
            canSaveAddress={canSaveAddress}
            isDuplicateAddress={isDuplicateAddress}
            addressHasChanged={addressHasChanged}
            savedAddresses={savedAddresses}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressSelector;
