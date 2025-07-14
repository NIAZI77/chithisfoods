"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import Hero from "../components/Side-Hero";
import Image from "next/image";
import { getCookie } from "cookies-next";
import Loading from "../loading";
import Spinner from "../components/Spinner";

export default function BecomeVendor() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    storeName: "",
    username: "",
    bio: "",
    businessAddress: "",
    email: "",
    city: "",
    zipcode: "",
    fullName: "",
    phoneNumber: "",
    avatar: { id: 0, url: "" },
    coverImage: { id: 0, url: "" },
  });
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalSteps = 3;

  const checkIfVendor = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.data.length > 0) {
        router.push("/vendor/dashboard");
      }
    } catch (error) {
      toast.error("Could not verify your vendor status. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    } else {
      checkIfVendor(storedUser);
      setFormData((prev) => ({ ...prev, email: storedUser }));
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldsForStep = () => {
    switch (step) {
      case 1:
        return ["storeName", "businessAddress", "zipcode", "city"];
      case 2:
        return ["fullName", "phoneNumber"];
      case 3:
        return ["avatar", "coverImage"];
      default:
        return [];
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const requiredFields = getFieldsForStep();
    const allFilled = requiredFields.every((field) => {
      const value = formData[field];
      return typeof value === "object" ? value.url : value.trim() !== "";
    });

    if (!allFilled && step !== totalSteps) {
      toast.error("Please complete all required fields before continuing.");
      return;
    }

    if (step === totalSteps) {
      await handleSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const uploadImage = async (file, name) => {
    const form = new FormData();
    form.append("files", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        toast.error("Failed to upload image. Please try again.");
        return;
      }

      const data = await res.json();
      const { id, url } = data[0];
      const fullUrl = new URL(url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url: fullUrl },
      }));
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) uploadImage(file, name);
  };

  const createVendor = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: formData }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Congratulations! You're now registered as a vendor.");
        setTimeout(() => {
          router.push("/vendor/dashboard");
        }, 1000);
      } else {
        toast.error(
          `Unable to create vendor profile: ${data?.error?.message || "Unknown error."
          }`
        );
      }
    } catch (error) {
      toast.error(
        "Something went wrong while submitting your information. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const usernameRegex = /^[a-z0-9_]{3,15}$/;
    const phoneRegex = /^\+?(\d{1,3})?[-. (]*\d{1,4}[-. )]*\d{1,4}[-. ]*\d{1,9}$/;
    if (formData.zipcode.length !== 5) {
      toast.error("ZIP Code must be 5 digits.");
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      toast.error(
        "Username can contain lowercase letters, numbers, and underscores (3-15 chars)."
      );
      return;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error(
        "Invalid Phone Number Format"
      );
      return;
    }
    if (formData.avatar.url.length === 0 || formData.coverImage.url.length === 0) {
      toast.error("Please upload both profile and cover images");
      return;
    }
    await createVendor();
  };

  if (loading) return <Loading />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />
      <div className="flex flex-col items-center md:p-12 p-6 w-full">
        <h2 className="text-2xl font-bold mb-6">BECOME A VENDOR</h2>

        <div className="flex justify-between w-full max-w-md mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 w-full mx-1 rounded-full ${step > index ? "bg-red-500" : "bg-gray-300"
                }`}
            ></div>
          ))}
        </div>

        <form className="w-full max-w-md" onSubmit={handleNext}>
          {step === 1 && (
            <div>
              <h2 className="font-bold text-2xl my-4">Business Information</h2>
              <input
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Store Name"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <input
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Business Address"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <input
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400 md:h-24 resize-none"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-2xl my-4">Vendor Details</h2>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-2xl my-4">Display Profile</h2>
              <div className="relative w-full mb-16">
                <div
                  className="bg-cover bg-center w-full aspect-video rounded-lg"
                  style={{
                    backgroundImage: `url("${formData.coverImage?.url || "/fallback.png"
                      }")`,
                  }}
                >
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="coverImage"
                    className="w-8 h-8 overflow-hidden absolute right-2 bottom-2 cursor-pointer bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <FaCamera />
                  </label>
                </div>

                <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-slate-100">
                  <img
                    src={formData.avatar.url || "/fallback.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label
                  htmlFor="avatar"
                  className="absolute bottom-[-40px] cursor-pointer left-1/2 transform -translate-x-1/2 w-8 h-8 overflow-hidden bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FaCamera />
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between w-full mt-6">
            {step > 1 && (
              <button
                type="button"
                className="w-12 h-12 bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all flex items-center justify-center"
                onClick={() => setStep((prev) => prev - 1)}
              >
                <FaArrowLeft />
              </button>
            )}
            <button
              type="submit"
              className={`${step > 1 ? "w-[calc(100%-55px)]" : "w-full"
                } bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all disabled:bg-rose-300 disabled:cursor-not-allowed`}
              disabled={submitting}
            >
              {submitting
                ? <Spinner />
                : step === totalSteps
                  ? "Submit"
                  : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
