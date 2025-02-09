"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function VendorForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: { id: 0, url: "" },
    email: "",
    coverImage: { id: 0, url: "" },
    description: "",
    location: {
      city: "",
      state: "",
      zipcode: "",
      country: "",
      fullAddress: "",
    },
    rating: 0,
    menu: [],
    offers: [],
    isTopRated: false,
  });

  const getCookie = (name) => {
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };

  useEffect(() => {
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");
    setEmail(storedUser);

    if (!storedJwt || !storedUser) router.push("/login");
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [locationField]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadImage = async (file, name) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Error uploading image");
        return;
      }

      toast.success("Image uploaded successfully!");
      const data = await response.json();
      const { id, url } = data[0];
      setFormData((prevData) => ({ ...prevData, [name]: { id, url } }));
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Error uploading image");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) uploadImage(file, name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.logo.url || !formData.coverImage.url) {
      toast.error("Please upload both logo and cover image.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              ...formData,
              email,
              description: formData.description || "No description provided",
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Now you are Vendor!");
        setTimeout(() => {
          router.push("/vendor/dashboard");
        }, 1000);
      } else {
        toast.error(data.error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[80%] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h1 className="text-center text-2xl font-bold pt-8">Become Vendor</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <input
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
            className="bg-cover bg-center w-full"
            style={{
              backgroundImage: formData.coverImage.url
                ? `url('${formData.coverImage.url}')`
                : "url('/img.png')",
              aspectRatio: "3 / 1",
            }}
          >
            <label
              className="w-5 h-5 overflow-hidden absolute right-10 bottom-5 cursor-pointer"
              htmlFor="coverImage"
            >
              <FaCamera />
            </label>
          </div>

          <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img
              height={100}
              width={100}
              src={formData.logo.url || "/fallback-logo.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            className="absolute bottom-[-40px] ml-1 cursor-pointer left-1/2 transform -translate-x-1/2 w-5 h-5 overflow-hidden"
            htmlFor="logo"
          >
            <FaCamera />
          </label>
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
          <label className="block text-sm font-semibold">Bio</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief description of the vendor's services"
            className="w-full p-2 border border-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {["Country", "State", "City", "Zipcode"].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold">{label}</label>
              <input
                required
                type="text"
                name={`location.${label.toLowerCase()}`}
                value={formData.location[label.toLowerCase()]}
                onChange={handleChange}
                placeholder={label}
                className="w-full p-2 border border-slate-200"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold">Full Address</label>
          <input
            required
            type="text"
            name="location.fullAddress"
            value={formData.location.fullAddress}
            onChange={handleChange}
            placeholder="123 Main St, Buffalo, NY 10001"
            className="w-full p-2 border border-slate-200"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-orange-600 font-bold text-white rounded hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
