"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function AccountSettings() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    logo: { id: 0, url: "" },
    email: "",
    coverImage: { id: 0, url: "" },
    description: "",
    location: { city: "", state: "", zipcode: "", country: "" },
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
    } else {
      fetchVendorData(storedUser, storedJwt);
    }
  }, [router]);

  const fetchVendorData = async (email) => {
    setLoading(true);
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error.message || "Error fetching vendor data.");
      } else {
        const vendorData = data.data[0];
        if (vendorData.length == 0) {
          router.push("/become-vendor");
        } else {
          setFormData(vendorData);
        }
      }
    } catch (error) {
      toast.error("Error fetching vendor data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

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

      const data = await response.json();
      const { id, url } = data[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url },
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image", error);
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
    setSubmitting(true);
    const { name, email, location } = formData;

    if (
      !name ||
      !email ||
      !location.city ||
      !location.state ||
      !location.zipcode ||
      !location.country
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const storedJwt = getCookie("jwt");
    if (!storedJwt) {
      toast.error("Authentication token is missing");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${formData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              name: formData.name,
              logo: formData.logo.id,
              coverImage: formData.coverImage.id,
              description: formData.description || "no description provided",
              location: formData.location,
            },
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Account settings updated!");
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
  if (loading) {
    return <Loading />;
  }
  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="md:w-[70%] w-[90%] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-center text-2xl font-bold pt-8">
            Account Settings
          </h1>

          <div>
            <label className="block text-sm font-semibold pt-6">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full p-2 border border-slate-200 bg-gray-100"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="relative w-full">
            <div
              className="w-full mx-auto object-cover bg-center bg-no-repeat bg-cover rounded-lg relative"
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
              className="absolute bottom-[-40px] ml-1 left-1/2 cursor-pointer transform -translate-x-1/2 w-5 h-5 overflow-hidden"
              htmlFor="logo"
            >
              <FaCamera />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold pt-6">
              Store Name
            </label>
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
              className="w-full p-3 font-bold bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </main>
  );
}
