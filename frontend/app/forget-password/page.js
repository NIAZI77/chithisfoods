"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import Hero from "../components/Side-Hero";
import Spinner from "../components/Spinner";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user) {
      router.push("/");
    }
  }, [router]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(
        "Please enter your email address so we can help you reset your password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Great! We've sent a password reset link to your email. Please check your inbox."
        );
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(
          data?.error?.message ||
            "We couldn't process your request right now. Please try again."
        );
      }
    } catch {
      toast.error(
        "We're experiencing some technical difficulties. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <Hero />

        <div className="flex flex-col pt-10 items-center px-6 w-full">
          <div className="w-full max-w-md">
            <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
              Forgot Password
            </h2>

            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Reset Password"}
              </button>
            </form>

            <p className="text-center mt-4">
              Remember your password?
              <Link
                href="/login"
                className="w-full text-center block text-rose-600 py-3 rounded-full border-2 border-rose-600 my-2 hover:bg-rose-600 hover:text-white transition-all"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
