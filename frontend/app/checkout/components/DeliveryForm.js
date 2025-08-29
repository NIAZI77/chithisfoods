import React from 'react';
import { MapPin, Save, Edit, X, RotateCcw } from 'lucide-react';
import Spinner from '../../components/Spinner';

const DeliveryForm = ({
  formData,
  onFormChange,
  onSaveAddress,
  onUpdateAddress,
  onCancelEdit,
  editingAddress,
  savingAddress,
  selectedAddressId,
  showSaveButton = true
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "phone" ? value.replace(/[^0-9 +]/g, "") : value;
    onFormChange(name, sanitizedValue);
  };

  const canSave = formData.name && formData.phone && formData.address;

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
          className={`w-full px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm sm:text-base bg-slate-100 ${
            savingAddress ? "bg-slate-200" : ""
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
          className={`w-full px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm sm:text-base bg-slate-100 ${
            savingAddress ? "bg-slate-200" : ""
          }`}
          pattern="[0-9 +-]+"
          title="Please enter a valid phone number"
          disabled={savingAddress}
        />
      </div>
      
      <div className="sm:col-span-2">
        <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
          Street Address
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={savingAddress ? "Saving address..." : "Street Address"}
            className={`flex-1 px-3 sm:px-4 py-2 my-1 border rounded-full outline-rose-400 text-sm sm:text-base bg-slate-100 ${
              savingAddress ? "bg-slate-200" : ""
            }`}
            minLength="5"
            title="Please enter your complete street address"
            disabled={savingAddress}
          />
          
          {showSaveButton && !selectedAddressId && (
            <button
              type="button"
              onClick={editingAddress ? onUpdateAddress : onSaveAddress}
              disabled={!canSave || savingAddress}
              className="px-3 sm:px-4 py-2 my-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
              title={editingAddress ? "Update this address" : "Save this address for future use"}
            >
              {savingAddress ? (
                <>
                  <Spinner />
                  <span className="hidden sm:inline">{editingAddress ? "Updating..." : "Saving..."}</span>
                  <span className="sm:hidden">{editingAddress ? "Update" : "Save"}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">{editingAddress ? "Update Address" : "Save Address"}</span>
                  <span className="sm:hidden">{editingAddress ? "Update" : "Save"}</span>
                </>
              )}
            </button>
          )}
          
          {editingAddress && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3 sm:px-4 py-2 my-1 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
              title="Cancel editing"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
              <span className="sm:hidden">Cancel</span>
            </button>
          )}
          
          {!editingAddress && (formData.name || formData.phone || formData.address) && (
            <button
              type="button"
              onClick={() => {
                onFormChange('name', '');
                onFormChange('phone', '');
                onFormChange('address', '');
              }}
              className="px-3 sm:px-4 py-2 my-1 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-rose-400 disabled:cursor-not-allowed"
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
  );
};

export default DeliveryForm;
