"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import Hero from "../components/Side-Hero";
import { getCookie } from "cookies-next";
import Loading from "../loading";
import Spinner from "@/components/WhiteSpinner";
import VendorProfileLayout from "@/components/VendorProfileLayout";

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
      toast.error(
        "We couldn't verify your vendor status right now. Give it another try!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if username already exists
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[username][$eq]=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      return response.ok && data.data.length === 0;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return false;
    }
  };

  // Check if phone number already exists
  const checkPhoneAvailability = async (phoneNumber) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[phoneNumber][$eq]=${phoneNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      return response.ok && data.data.length === 0;
    } catch (error) {
      console.error("Error checking phone availability:", error);
      return false;
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

    const sanitizedValue =
      name === "phoneNumber" ? value.replace(/[^0-9 +]/g, "") : value;

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
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
      toast.error("Oops! Please fill in all the required fields to continue.");
      return;
    }

    if (step === totalSteps) {
      await handleSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const createVendor = async () => {
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
        toast.success("🎉 Congratulations! You're now a vendor!");
        setSubmitting(false);
        setTimeout(() => {
          router.push("/vendor/dashboard");
        }, 1000);
      } else {
        // Handle unique constraint errors specifically
        if (data?.error?.details?.errors) {
          const errors = data.error.details.errors;
          let errorMessage = "";

          // Check for specific unique constraint violations
          if (errors.some((err) => err.path.includes("email"))) {
            errorMessage =
              "This email address is already registered. Please use a different email.";
          } else if (errors.some((err) => err.path.includes("username"))) {
            errorMessage =
              "This username is already taken. Please choose a different username.";
          } else if (errors.some((err) => err.path.includes("phoneNumber"))) {
            errorMessage =
              "This phone number is already registered. Please use a different phone number.";
          } else {
            // Generic error message for other validation errors
            errorMessage =
              data?.error?.message ||
              "Something unexpected happened. Please try again.";
          }

          toast.error(errorMessage);
        } else {
          toast.error(
            data?.error?.message ||
              "Something unexpected happened. Please try again."
          );
        }
      }
    } catch (error) {
      toast.error(
        "We ran into an issue while processing your information. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const usernameRegex = /^[a-z0-9_]{3,15}$/;
    const phoneRegex =
      /^\+?(\d{1,3})?[-. (]*\d{1,4}[-. )]*\d{1,4}[-. ]*\d{1,9}$/;

    if (formData.zipcode.length !== 5) {
      toast.error("Please enter a valid 5-digit ZIP code to continue.");
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      toast.error(
        "Username can contain lowercase letters, numbers, and underscores (3-15 chars)."
      );
      return;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number format to continue.");
      return;
    }

    if (
      formData.avatar.url.length === 0 ||
      formData.coverImage.url.length === 0
    ) {
      toast.error(
        "Please upload both profile and cover images to complete your application"
      );
      return;
    }

    // Check for uniqueness before submitting
    setSubmitting(true);
    try {
      const [isUsernameAvailable, isPhoneAvailable] = await Promise.all([
        checkUsernameAvailability(formData.username),
        checkPhoneAvailability(formData.phoneNumber),
      ]);

      if (!isUsernameAvailable) {
        toast.error(
          "This username is already taken. Please choose a different username."
        );
        setSubmitting(false);
        return;
      }

      if (!isPhoneAvailable) {
        toast.error(
          "This phone number is already registered. Please use a different phone number."
        );
        setSubmitting(false);
        return;
      }

      // If all validations pass, proceed with vendor creation
      await createVendor();
    } catch (error) {
      toast.error(
        "We encountered an error while validating your information. Please try again."
      );
      setSubmitting(false);
    }
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
              className={`h-1 w-full mx-1 rounded-full ${
                step > index ? "bg-red-500" : "bg-gray-300"
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
              <p className="text-xs text-gray-500 mb-2">
                Username must be unique (3-15 characters, lowercase letters,
                numbers, underscores only)
              </p>
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
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg my-2 outline-rose-400"
              />
              <p className="text-xs text-gray-500 mb-2">
                Phone number must be unique and in a valid format
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-2xl my-4">Display Profile</h2>
              <div className="mb-12">
                <VendorProfileLayout
                  onCoverImageUpload={(imageData) => {
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: imageData,
                    }));
                  }}
                  onCoverImageRemove={() => {
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: { id: 0, url: "" },
                    }));
                  }}
                  onAvatarUpload={(imageData) => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: imageData,
                    }));
                  }}
                  onAvatarRemove={() => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: { id: 0, url: "" },
                    }));
                  }}
                  currentCoverImageUrl={formData.coverImage?.url || null}
                  currentAvatarUrl={formData.avatar?.url || null}
                />
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
              className={`${
                step > 1 ? "w-[calc(100%-55px)]" : "w-full"
              } bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all disabled:bg-rose-300 disabled:cursor-not-allowed`}
              disabled={submitting}
            >
              {submitting ? (
                <Spinner />
              ) : step === totalSteps ? (
                "Submit"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}