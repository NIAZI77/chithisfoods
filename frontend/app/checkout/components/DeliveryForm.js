import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, X, RotateCcw } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Spinner from "@/components/WhiteSpinner";
import { toast } from "react-toastify";

// Google Places Autocomplete Component - Memoized to prevent re-renders
const GooglePlacesAutocomplete = React.memo(
  ({
    value,
    onChange,
    onAddressSelect,
    googleMapsLoaded,
    savingAddress,
    formData,
    mapAddressData,
    addressHasChanged = false,
    savedAddresses = [],
    isDuplicateAddress = () => false,
  }) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [autocompleteInstance, setAutocompleteInstance] = useState(null);

    // Initialize autocomplete only once when component mounts
    useEffect(() => {
      if (
        googleMapsLoaded &&
        window.google &&
        window.google.maps &&
        !autocompleteInstance
      ) {
        const input = document.getElementById("google-places-input");
        if (input) {
          // Get zipcode from localStorage if available
          const storedZipCode =
            typeof window !== "undefined"
              ? localStorage.getItem("zipcode") || ""
              : "";

          const instance = new window.google.maps.places.Autocomplete(input, {
            types: ["address"],
            componentRestrictions: { country: "US" },
          });

          instance.addListener("place_changed", () => {
            const place = instance.getPlace();
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const formattedAddress = place.formatted_address;

              setInputValue(formattedAddress);
              onChange(formattedAddress);

              if (onAddressSelect) {
                onAddressSelect({
                  formatted_address: formattedAddress,
                  lat,
                  lng,
                });
              }
            }
          });

          setAutocompleteInstance(instance);
        }
      }
    }, [googleMapsLoaded, onChange, onAddressSelect, autocompleteInstance]);

    // Update input value when prop changes
    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    return (
      <div className="relative">
        <input
          id="google-places-input"
          type="text"
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            // Call onChange to update parent form when user types manually
            onChange(newValue);
          }}
          onKeyDown={(e) => {
            // Prevent form submission when Enter is pressed for address selection
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          placeholder="Enter your delivery address"
          className={`flex-1 px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm 
            sm:text-base bg-slate-100 w-full ${savingAddress ? "bg-slate-200" : ""
            }`}
          autoComplete="off"
          disabled={savingAddress}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {(() => {
            // Check if address matches Google Maps result exactly
            const matchesGoogle = formData.address === mapAddressData?.formatted_address &&
              mapAddressData?.lat &&
              mapAddressData?.lng;

            // Check if address matches a saved address
            const matchesSavedAddress = savedAddresses.some(addr =>
              addr.name.toLowerCase() === formData.name.toLowerCase() &&
              addr.phone === formData.phone &&
              addr.address.toLowerCase() === formData.address.toLowerCase()
            );

            // Check if address field has been manually modified (not from Google selection)
            const addressFieldChanged = addressHasChanged && formData.address;

            if (matchesGoogle || matchesSavedAddress) {
              return (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              );
            } else {
              return <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />;
            }
          })()}
        </div>
      </div>
    );
  }
);

// Set display name for the memoized component
GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";

const DeliveryForm = ({
  formData,
  onFormChange,
  onSaveAddress,
  onUpdateAddress,
  onCancelEdit,
  editingAddress,
  savingAddress,
  selectedAddressId,
  showSaveButton = true,
  onAddressSelect,
  onMarkerDrag,
  googleMapsLoaded,
  showMap,
  mapAddressData,
  canSaveAddress = false,
  isDuplicateAddress = () => false,
  addressHasChanged = false,
  savedAddresses = [],
}) => {
  // Google Map Component
  const DeliveryMap = ({ lat, lng, onMarkerDrag }) => {
    const mapCenter = useMemo(
      () => ({
        lat: lat || 40.7128,
        lng: lng || -74.006,
      }),
      [lat, lng]
    );

    const handleMarkerDragEnd = useCallback(
      (e) => {
        if (onMarkerDrag) {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          onMarkerDrag(newLat, newLng);
        }
      },
      [onMarkerDrag]
    );

    return (
      <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={15}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {lat && lng && (
            <Marker
              position={{ lat, lng }}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "phone" ? value.replace(/[^0-9 +]/g, "") : value;
    onFormChange(name, sanitizedValue);
  };

  // Check if any field has changed from the original values
  const hasChanges =
    editingAddress &&
    (formData.name !== editingAddress.name ||
      formData.phone !== editingAddress.phone ||
      formData.address !== editingAddress.address ||
      formData.formatted_address !== editingAddress.formatted_address ||
      formData.lat !== editingAddress.lat ||
      formData.lng !== editingAddress.lng);

  // Use the validation state from parent component
  const canSave = canSaveAddress;

  // Debug logging
  if (editingAddress) {
    console.log("Debug - Editing Address:", {
      original: {
        name: editingAddress.name,
        phone: editingAddress.phone,
        address: editingAddress.address,
        formatted_address: editingAddress.formatted_address,
        lat: editingAddress.lat,
        lng: editingAddress.lng,
      },
      current: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        formatted_address: formData.formatted_address,
        lat: formData.lat,
        lng: formData.lng,
      },
      hasChanges,
      canSave,
    });
  }

  // Debug map display
  console.log("Debug - Map Display:", {
    showMap,
    formDataLat: formData.lat,
    formDataLng: formData.lng,
    mapAddressLat: mapAddressData?.lat,
    mapAddressLng: mapAddressData?.lng,
    hasCoordinates: !!(mapAddressData?.lat && mapAddressData?.lng),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
      <div>
        <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
          Full Name
        </label>
        <input
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={savingAddress ? "Saving..." : "Full Name"}
          className={`w-full px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm sm:text-base bg-slate-100 ${savingAddress ? "bg-slate-200" : ""
            }`}
          minLength="2"
          title="Please enter your full name"
          disabled={savingAddress}
        />
      </div>

      <div>
        <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
          Phone Number
        </label>
        <input
          required
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={savingAddress ? "Saving..." : "Phone Number"}
          className={`w-full px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm sm:text-base bg-slate-100 ${savingAddress ? "bg-slate-200" : ""
            }`}
          pattern="[0-9 +-]+"
          title="Please enter a valid phone number"
          disabled={savingAddress}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
          Address
        </label>
        <div className="">
          <GooglePlacesAutocomplete
            value={formData.address}
            onChange={(value) => {
              // Update the address field when user types manually
              onFormChange("address", value);

              // Clear coordinates when address changes (map will disappear)
              if (mapAddressData?.lat && mapAddressData?.lng) {
                onFormChange("lat", null);
                onFormChange("lng", null);
                onFormChange("formatted_address", "");
              }

            }}
            onAddressSelect={(addressData) => {
              // When Google Places address is selected, update form data with coordinates
              onFormChange("lat", addressData.lat);
              onFormChange("lng", addressData.lng);
              onFormChange("formatted_address", addressData.formatted_address);
              // Call the parent handler
              onAddressSelect(addressData);
            }}
            googleMapsLoaded={googleMapsLoaded}
            savingAddress={savingAddress}
            formData={formData}
            mapAddressData={mapAddressData}
            addressHasChanged={addressHasChanged}
            savedAddresses={savedAddresses}
            isDuplicateAddress={isDuplicateAddress}
          />


          <div className="flex justify-end gap-2 mt-2">
            {showSaveButton && !selectedAddressId && (
              <button
                type="button"
                onClick={editingAddress ? onUpdateAddress : onSaveAddress}
                disabled={!canSave || savingAddress}
                className="bg-rose-600 text-white py-2 px-6 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
                title={
                  editingAddress
                    ? "Update this address"
                    : isDuplicateAddress()
                      ? "This address is already saved"
                      : "Save this address for future use"
                }
              >
                {savingAddress ? (
                  <>
                    <Spinner />
                    <span className="hidden sm:inline">
                      {editingAddress ? "Updating..." : "Saving..."}
                    </span>
                    <span className="sm:hidden">
                      {editingAddress ? "Update" : "Save"}
                    </span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {editingAddress ? "Update Address" : "Save Address"}
                    </span>
                    <span className="sm:hidden">
                      {editingAddress ? "Update" : "Save"}
                    </span>
                  </>
                )}
              </button>
            )}

            {editingAddress && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="bg-rose-600 text-white py-2 px-6 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
                title="Cancel editing"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}

            {!editingAddress &&
              (formData.name || formData.phone || formData.address) && (
                <button
                  type="button"
                  onClick={() => {
                    onFormChange("name", "");
                    onFormChange("phone", "");
                    onFormChange("address", "");
                    onFormChange("formatted_address", "");
                    onFormChange("lat", null);
                    onFormChange("lng", null);
                  }}
                  className="bg-rose-600 text-white py-2 px-6 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all text-sm md:text-base font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
                  title="Clear form fields and enter new address"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear & New</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Google Map Display - Show when address is valid (Google Maps or saved address) */}
      {(() => {
        // Check if address matches Google Maps result exactly
        const matchesGoogle = formData.address === mapAddressData?.formatted_address &&
          mapAddressData?.lat &&
          mapAddressData?.lng;

        // Check if address matches a saved address
        const matchesSavedAddress = savedAddresses.some(addr =>
          addr.name.toLowerCase() === formData.name.toLowerCase() &&
          addr.phone === formData.phone &&
          addr.address.toLowerCase() === formData.address.toLowerCase()
        );

        // Show map if Google Maps match OR saved address match
        if ((matchesGoogle || matchesSavedAddress) && mapAddressData.lat && mapAddressData.lng) {
          return (
            <div className="mt-4 sm:col-span-2">
              <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-2">
                Delivery Location Map
              </label>
              <DeliveryMap
                lat={mapAddressData.lat}
                lng={mapAddressData.lng}
                onMarkerDrag={onMarkerDrag}
              />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default DeliveryForm;
