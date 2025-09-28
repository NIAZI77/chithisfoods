"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import Spinner from "@/components/WhiteSpinner";

export default function AdminForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwt = getCookie("AdminJWT");
    const user = getCookie("AdminUser");

    if (jwt && user) {
      router.push("/admin/dashboard");
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
      // 1) Verify the email belongs to an admin account before sending reset
      const userLookupRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users?filters[email][$eq]=${encodeURIComponent(
          email
        )}&fields[0]=email&fields[1]=isAdmin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!userLookupRes.ok) {
        throw new Error("User lookup failed");
      }

      const users = await userLookupRes.json();
      const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

      if (!user || !user.isAdmin) {
        toast.error("Only admin accounts can request a reset here.");
        return;
      }

      // 2) Proceed to request forgot-password for admin
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
        setTimeout(() => router.push("/admin/login"), 2000);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Forgot Password
        </h2>

        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Admin Email"
              className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-pink-600 hover:underline"
          >
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}


