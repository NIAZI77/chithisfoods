"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import { FaCamera } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VendorForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    logo: {
      id: 0,
      url: "",
    },
    coverImage: {
      id: 0,
      url: "",
    },
    description: "",
    location: {
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
    deliveryOptions: [
      {
        deliveryType: "Local Delivery",
        fee: "",
        minOrderValue: "",
        deliveryTimeEstimate: "",
        serviceArea: "",
      },
      {
        deliveryType: "Pickup",
        fee: "",
        minOrderValue: "",
        pickupInstructions: "",
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

    if (type === "checkbox") {
      if (name === "isVegetarian") {
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
    } else if (name.includes("location")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]: value,
        },
      }));
    } else if (name.startsWith("deliveryOptions")) {
      const [optionIndex, optionField] = name.split(".").slice(1);
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
    formData.append("files", file);

    try {
      const response = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error uploading image");
      }
      toast.success("Image uploaded successfully!");
      const data = await response.json();
      const id = data[0].id;
      const url = data[0].url;

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url },
      }));
    } catch (error) {
      console.log("Error uploading image");
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
      const response = await fetch("http://localhost:1337/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        toast.success("Now you are Vendor!");
      } else {
        toast.error("Error submitting form");
      }
    } catch (error) {
      toast.error("Error submitting form");
    }
  };
  return (
    <div className="md:w-[70%] w-[90%] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-center text-2xl font-bold pt-8">Become Vendor</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              required
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <input
              required
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="relative w-full">
          <div
            className="w-full h-56 bg-cover bg-center"
            style={{
              backgroundImage: formData.coverImage.url
                ? `url('${formData.coverImage.url}')`
                : "url('https://via.placeholder.com/300x800')",
            }}
          >
            <button
              className="w-5 h-5 overflow-hidden absolute right-10 bottom-5"
              onClick={() => document.getElementById("coverImage").click()}
            >
              <FaCamera />
            </button>
          </div>

          <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img
              height={100}
              width={100}
              src={
                formData.logo.url
                  ? formData.logo.url
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="absolute bottom-[-40px] ml-1 left-1/2 transform -translate-x-1/2 w-5 h-5 overflow-hidden"
            onClick={() => document.getElementById("logo").click()}
          >
            <FaCamera />
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold pt-6">Store Name</label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-2 border border-slate-200"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold">Country</label>
            <input
              required
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
              required
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
              required
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
              required
              type="text"
              name="location.zipcode"
              value={formData.location.zipcode}
              onChange={handleChange}
              placeholder="10001"
              className="w-full p-2 border border-slate-200"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-center">
            Delivery Options
          </h3>
          {formData.deliveryOptions.map((option, index) => (
            <div key={index} className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-orange-400">
                {option.deliveryType}
              </h4>

              <div>
                <label className="block text-sm font-semibold">Fee</label>
                <input
                  required
                  type="text"
                  name={`deliveryOptions.${index}.fee`}
                  value={option.fee}
                  onChange={handleChange}
                  placeholder="$5.00"
                  className="w-full p-2 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Minimum Order Value
                </label>
                <input
                  required
                  type="text"
                  name={`deliveryOptions.${index}.minOrderValue`}
                  value={option.minOrderValue}
                  onChange={handleChange}
                  placeholder="$20.00"
                  className="w-full p-2 border border-slate-200"
                />
              </div>

              {option.deliveryType === "Local Delivery" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold">
                      Delivery Time Estimate
                    </label>
                    <input
                      required
                      type="text"
                      name={`deliveryOptions.${index}.deliveryTimeEstimate`}
                      value={option.deliveryTimeEstimate}
                      onChange={handleChange}
                      placeholder="30-45 minutes"
                      className="w-full p-2 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold">
                      Service Area
                    </label>
                    <input
                      required
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

              {option.deliveryType === "Pickup" && (
                <div>
                  <label className="block text-sm font-semibold">
                    Pickup Instructions
                  </label>
                  <input
                    required
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
                  required
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
          <button
            type="submit"
            className="w-full p-3 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
