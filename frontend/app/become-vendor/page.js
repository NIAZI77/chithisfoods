"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function VendorForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    logo: {
      id: 0,
      url: "",
    },
    email: "",
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
    rating: 0,
    menu: [],
    offers: [],
    isTopRated: false,
    review: [],
  });

  const getCookie = (name) => {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookie = cookieArr[i].trim();
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };

  useEffect(() => {
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]: value,
        },
      }));
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
        return;
      }

      toast.success("Image uploaded successfully!");
      const data = await response.json();
      const { id, url } = data[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url },
      }));
    } catch (error) {
      console.log("Error uploading image", error);
      toast.error("Error uploading image");
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
    setFormData((prevData) => ({
      ...prevData,
      email: getCookie("user"),
    }));

    try {
      const response = await fetch("http://localhost:1337/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            ...formData,
            description: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: formData.description,
                  },
                ],
              },
            ],
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Now you are Vendor!");
        router.push("/vendor-dashboard");
      } else {
        toast.error(data.error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
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
            className="w-full md:h-56 h-36 bg-cover bg-center"
            style={{
              backgroundImage: formData.coverImage.url
                ? `url('${formData.coverImage.url}')`
                : "url('https://via.placeholder.com/300x800')",
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
              src={
                formData.logo.url
                  ? formData.logo.url
                  : "https://via.placeholder.com/150"
              }
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
