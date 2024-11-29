"use client";

import { useState } from 'react';

export default function BecomeVendor() {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorDescription: '',
    location: {
      city: '',
      state: '',
      zipcode: '',
    },
    deliveryOptions: [
      { deliveryType: 'Local Delivery', fee: '', minOrderValue: '' },
      { deliveryType: 'Pickup', fee: '', minOrderValue: '' },
    ],
    hoursOfOperation: {
      monday: { open: false, openTime: '', closeTime: '' },
      tuesday: { open: false, openTime: '', closeTime: '' },
      wednesday: { open: false, openTime: '', closeTime: '' },
      thursday: { open: false, openTime: '', closeTime: '' },
      friday: { open: false, openTime: '', closeTime: '' },
      saturday: { open: false, openTime: '', closeTime: '' },
      sunday: { open: false, openTime: '', closeTime: '' },
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [mainField, subField] = name.split('.');

    if (type === 'checkbox') {
      value = checked;
    }

    if (subField) {
      setFormData((prevData) => ({
        ...prevData,
        [mainField]: {
          ...prevData[mainField],
          [subField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [mainField]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const response = await fetch('/api/create-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Vendor application submitted successfully!');
      } else {
        alert('There was an issue submitting your vendor application.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Become a Vendor</h1>
      <p className="text-center mb-8">Join our platform to sell your products and grow your business.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="vendorName" className="block text-sm font-semibold">Vendor Name</label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-orange-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="vendorDescription" className="block text-sm font-semibold">Vendor Description</label>
          <textarea
            id="vendorDescription"
            name="vendorDescription"
            value={formData.vendorDescription}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-orange-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold">City</label>
            <input
              type="text"
              id="city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-orange-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-semibold">State</label>
            <input
              type="text"
              id="state"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-orange-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="zipcode" className="block text-sm font-semibold">Zipcode</label>
            <input
              type="text"
              id="zipcode"
              name="location.zipcode"
              value={formData.location.zipcode}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-orange-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Delivery Options</h3>
          {formData.deliveryOptions.map((option, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label htmlFor={`deliveryType-${index}`} className="block text-sm font-semibold">Delivery Type</label>
                <input
                  type="text"
                  id={`deliveryType-${index}`}
                  name={`deliveryOptions[${index}].deliveryType`}
                  value={option.deliveryType}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor={`fee-${index}`} className="block text-sm font-semibold">Fee</label>
                <input
                  type="number"
                  id={`fee-${index}`}
                  name={`deliveryOptions[${index}].fee`}
                  value={option.fee}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor={`minOrderValue-${index}`} className="block text-sm font-semibold">Minimum Order Value</label>
                <input
                  type="number"
                  id={`minOrderValue-${index}`}
                  name={`deliveryOptions[${index}].minOrderValue`}
                  value={option.minOrderValue}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Hours of Operation</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(formData.hoursOfOperation).map((day) => (
              <div key={day} className="space-y-2 bg-orange-100 p-4">
                <label className="block text-sm font-semibold">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <div className="flex items-center justify-between py-3">
                  <label htmlFor={`${day}-open`} className="block text-sm font-semibold">Open</label>
                  <input
                    type="checkbox"
                    id={`${day}-open`}
                    name={`hoursOfOperation.${day}.open`}
                    checked={formData.hoursOfOperation[day].open}
                    onChange={handleChange}
                    className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor={`${day}-openTime`} className="block text-sm font-semibold">Open Time</label>
                  <input
                    type="time"
                    id={`${day}-openTime`}
                    name={`hoursOfOperation.${day}.openTime`}
                    value={formData.hoursOfOperation[day].openTime}
                    onChange={handleChange}
                    className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                    disabled={!formData.hoursOfOperation[day].open}
                  />
                </div>
                <div>
                  <label htmlFor={`${day}-closeTime`} className="block text-sm font-semibold">Close Time</label>
                  <input
                    type="time"
                    id={`${day}-closeTime`}
                    name={`hoursOfOperation.${day}.closeTime`}
                    value={formData.hoursOfOperation[day].closeTime}
                    onChange={handleChange}
                    className="w-full p-3 mt-1 border border-orange-300 rounded-md"
                    disabled={!formData.hoursOfOperation[day].open}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
