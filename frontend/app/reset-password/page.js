"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Hero from "../components/Hero";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const jwt = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="));
    const user = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (jwt && user) router.push("/");
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password.length < 6 || password.length > 15) {
      toast.error("Password must be between 6 and 15 characters.");
      setLoading(false);
      return;
    }
    if (!code) {
      toast.error("Reset code is missing or invalid.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            password,
            passwordConfirmation: confirmPassword,
            code,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error?.message || "Failed to reset password.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
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
            <h2 className="text-center text-2xl font-bold mt-10 mb-6">
              Reset Password
            </h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
