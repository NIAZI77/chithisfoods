"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import Hero from "../components/Hero";
import Image from "next/image";

export default function BecomeVendor() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 4;
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    city: "",
    zipCode: "",
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    logo: { id: 0, url: "" },
    coverImage: { id: 0, url: "" },
    ein: "",
    governmentId: "",
    tin: "",
    salesTaxPermit: "",
    bankAccount: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFieldsForStep = () => {
    switch (step) {
      case 1:
        return ["businessName", "businessAddress", "zipCode"];
      case 2:
        return ["fullName", "phoneNumber", "emailAddress"];
      case 3:
        return ["logo", "coverImage"];
      case 4:
        return ["ein", "governmentId", "tin", "salesTaxPermit", "bankAccount"];
      default:
        return [];
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const requiredFields = getFieldsForStep();
    const allFilled = requiredFields.every((field) => {
      const value = formData[field];
      return typeof value === "object" ? value.url : value.trim() !== "";
    });

    if (!allFilled) {
      toast.error("Fill all fields of this step");
      return;
    }

    if (step === totalSteps) {
      handleSubmit();
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
        toast.error("Error uploading image");
        return;
      }

      const data = await res.json();
      const { id, url } = data[0];
      setFormData((prevData) => ({ ...prevData, [name]: { id, url } }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) uploadImage(file, name);
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify(formData));
    // setSubmitting(true);
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    //       },
    //       body: JSON.stringify({
    //         data: {
    //           ...formData,
    //           email: email,
    //           description: "Vendor registration",
    //         },
    //       }),
    //     }
    //   );

    //   const data = await res.json();

    //   if (res.ok) {
    //     toast.success("Now You Are A Vendor");
    //     setTimeout(() => {
    //       router.push("/vendor/dashboard");
    //     }, 1500);
    //   } else {
    //     toast.error(data?.error?.message || "An error occurred");
    //   }
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   toast.error("An error occurred while submitting the form");
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <>
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
                <h2 className="font-bold text-2xl my-4">
                  Business Information
                </h2>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
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
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
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
                <input
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-bold text-2xl my-4">Display Profile</h2>
                <div className="relative w-full mb-16">
                  <div
                    className="bg-cover bg-center w-full aspect-video bg-slate-100"
                    style={{
                      backgroundImage: `url(${
                        formData.coverImage?.url || "/fallback.png"
                      })`,
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
                      className="w-5 h-5 overflow-hidden absolute right-10 bottom-5 cursor-pointer"
                    >
                      <FaCamera />
                    </label>
                  </div>
                  <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-slate-100">
                    <Image
                      height={100}
                      width={100}
                      src={formData.logo.url || "/fallback.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="logo"
                    className="absolute bottom-[-40px] ml-1 cursor-pointer left-1/2 transform -translate-x-1/2 w-5 h-5 overflow-hidden"
                  >
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <FaCamera />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-bold text-2xl my-4">
                  Legal & Tax Information
                </h2>
                <input
                  name="ein"
                  value={formData.ein}
                  onChange={handleChange}
                  placeholder="Business Registration Number (EIN)"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
                <input
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleChange}
                  placeholder="Government-Issued ID"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
                <input
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  placeholder="Taxpayer Identification Number (TIN/SSN)"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
                <input
                  name="salesTaxPermit"
                  value={formData.salesTaxPermit}
                  onChange={handleChange}
                  placeholder="Sales Tax Permit (If applicable)"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
                <input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="Bank Account Details"
                  className="w-full p-3 border rounded-lg my-2 outline-rose-400"
                />
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
                {submitting
                  ? "Submitting..."
                  : step === totalSteps
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
