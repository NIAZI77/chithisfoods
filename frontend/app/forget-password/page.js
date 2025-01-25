"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

    if (storedJwt && storedUser) {
      router.push("/");
      return;
    }
  }, []);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset link sent! Please check your email.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(
          data.error.message ||
            "Failed to send password reset link. Please try again."
        );
      }
    } catch (err) {
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full bg-white shadow-lg md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-2 space-y-2 md:space-y-3 sm:p-8 bg-slate-50">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Forgot Password
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleForgotPassword}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                  placeholder="Your Email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full font-bold text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm">
                Remember your password?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-medium text-orange-600 hover:text-orange-700"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
