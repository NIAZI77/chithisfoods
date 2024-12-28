'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VendorForm() {
  const [formData, setFormData] = useState({
    name: '',
    logo: {
      id: 0,
      url: ""
    },
    coverImage: {
      id: 0,
      url: ""
    },
    description: '',
    email: '',
    location: {
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    deliveryOptions: [
      {
        deliveryType: 'Local Delivery',
        fee: '',
        minOrderValue: '',
        deliveryTimeEstimate: '',
        serviceArea: '',
      },
      {
        deliveryType: 'Pickup',
        fee: '',
        minOrderValue: '',
        pickupInstructions: '',
      },
    ],
    hoursOfOperation: {
      monday: { open: false },
      tuesday: { open: false },
      wednesday: { open: false },
      thursday: { open: false },
      friday: { open: false },
      saturday: { open: false },
      sunday: { open: false },
    },
    ratting: 0,
    menu: [],
    offers: [],
    isTopRated: true,
    isVegetarian: true,
    review: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'isVegetarian') {
        setFormData((prevData) => ({
          ...prevData,
          isVegetarian: checked,
        }));
      } else if (name in formData.hoursOfOperation) {
        setFormData((prevData) => ({
          ...prevData,
          hoursOfOperation: {
            ...prevData.hoursOfOperation,
            [name]: { open: checked },
          },
        }));
      }
    } else if (name.includes('location')) {
      const locationField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]: value,
        },
      }));
    } else if (name.startsWith('deliveryOptions')) {
      const [optionIndex, optionField] = name.split('.').slice(1);
      setFormData((prevData) => {
        const updatedDeliveryOptions = [...prevData.deliveryOptions];
        updatedDeliveryOptions[optionIndex] = {
          ...updatedDeliveryOptions[optionIndex],
          [optionField]: value,
        };
        return { ...prevData, deliveryOptions: updatedDeliveryOptions };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  async function uploadImage(file, name) {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error('Error uploading image');
      }
      toast.success('Image uploaded successfully!');
      const data = await response.json();
      const id = data[0].id;
      const url = data[0].url;

      setFormData((prevData) => ({
        ...prevData,
        [name]: {id,url},
      }));
    } catch (error) {
      console.log('Error uploading image');
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      uploadImage(file, name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1337/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        toast.success('Now you are Vendor!');
      } else {
        toast.error('Error submitting form');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="md:w-[70%] w-[90%] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-center text-2xl font-bold pt-8">Become Vendor</h1>

        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-2 border border-slate-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief description of the vendor's services"
            className="w-full p-2 border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@example.com"
            className="w-full p-2 border border-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold">Country</label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              placeholder="USA"
              className="w-full p-2 border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">State</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              placeholder="New York"
              className="w-full p-2 border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="Buffalo"
              className="w-full p-2 border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Zipcode</label>
            <input
              type="text"
              name="location.zipcode"
              value={formData.location.zipcode}
              onChange={handleChange}
              placeholder="10001"
              className="w-full p-2 border border-slate-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label htmlFor="logo" className="block text-sm font-semibold">Logo</label>
            <button
              type="button"
              onClick={() => document.getElementById('logo').click()}
              className="w-full p-2 border-2 border-orange-600 text-sm font-bold text-orange-600 hover:bg-orange-600 transition-all hover:text-white"
            >
              {!formData.logo.url ? "Upload Image" : "Change Image"}
            </button>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="coverImage" className="block text-sm font-semibold">Cover Image</label>
            <button
              type="button"
              onClick={() => document.getElementById('coverImage').click()}
              className="w-full p-2 border-2 border-orange-600 text-sm font-bold text-orange-600 hover:bg-orange-600 transition-all hover:text-white"
            >
              {!formData.coverImage.url ? "Upload Image" : "Change Image"}
            </button>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-center">Delivery Options</h3>
          {formData.deliveryOptions.map((option, index) => (
            <div key={index} className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-orange-400">{option.deliveryType}</h4>

              <div>
                <label className="block text-sm font-semibold">Fee</label>
                <input
                  type="text"
                  name={`deliveryOptions.${index}.fee`}
                  value={option.fee}
                  onChange={handleChange}
                  placeholder="$5.00"
                  className="w-full p-2 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Minimum Order Value</label>
                <input
                  type="text"
                  name={`deliveryOptions.${index}.minOrderValue`}
                  value={option.minOrderValue}
                  onChange={handleChange}
                  placeholder="$20.00"
                  className="w-full p-2 border border-slate-200"
                />
              </div>

              {option.deliveryType === 'Local Delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold">Delivery Time Estimate</label>
                    <input
                      type="text"
                      name={`deliveryOptions.${index}.deliveryTimeEstimate`}
                      value={option.deliveryTimeEstimate}
                      onChange={handleChange}
                      placeholder="30-45 minutes"
                      className="w-full p-2 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold">Service Area</label>
                    <input
                      type="text"
                      name={`deliveryOptions.${index}.serviceArea`}
                      value={option.serviceArea}
                      onChange={handleChange}
                      placeholder="Manhattan, Brooklyn, Queens"
                      className="w-full p-2 border border-slate-200"
                    />
                  </div>
                </>
              )}

              {option.deliveryType === 'Pickup' && (
                <div>
                  <label className="block text-sm font-semibold">Pickup Instructions</label>
                  <input
                    type="text"
                    name={`deliveryOptions.${index}.pickupInstructions`}
                    value={option.pickupInstructions}
                    onChange={handleChange}
                    placeholder="Pick up at the front counter"
                    className="w-full p-2 border border-slate-200"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold">Operating Hours</label>
          <div className="space-y-2">
            {Object.keys(formData.hoursOfOperation).map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={day}
                  name={day}
                  checked={formData.hoursOfOperation[day].open}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label htmlFor={day} className="text-sm capitalize">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" className="w-full p-3 bg-orange-600 text-white rounded hover:bg-orange-700">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}