"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";
import Hero from "../components/Hero";

export default function BecomeVendor() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    zipCode: "",
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    profilePicture: "",
    coverImage: "",
    ein: "",
    governmentId: "",
    tin: "",
    salesTaxPermit: "",
    bankAccount: "",
  });

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
        return ["profilePicture", "coverImage"];
      case 4:
        return ["ein", "governmentId", "tin", "salesTaxPermit", "bankAccount"];
      default:
        return [];
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const requiredFields = getFieldsForStep();
    const allFilled = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );

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

  const handleSubmit = () => {
    setSubmitting(true);
    console.log(JSON.stringify(formData));
    setTimeout(() => {
      // router.push("/");
      setSubmitting(false);
      toast.success("Now You Are A Vendor");
    }, 1500);
  };

  return (
    <>
      <ToastContainer />
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
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Business Address"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className="w-full p-3 border rounded-lg my-2"
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
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-lg my-2"
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-bold text-2xl my-4">Display Profile</h2>
                <input
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="Profile Picture URL"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Cover Image URL"
                  className="w-full p-3 border rounded-lg my-2"
                />
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
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleChange}
                  placeholder="Government-Issued ID"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  placeholder="Taxpayer Identification Number (TIN/SSN)"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="salesTaxPermit"
                  value={formData.salesTaxPermit}
                  onChange={handleChange}
                  placeholder="Sales Tax Permit (If applicable)"
                  className="w-full p-3 border rounded-lg my-2"
                />
                <input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="Bank Account Details"
                  className="w-full p-3 border rounded-lg my-2"
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
               {submitting ? "Submitting..." : step === totalSteps ? "Submit" : "Next"}

              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
