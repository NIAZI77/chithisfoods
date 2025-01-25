"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    if (!code) {
      toast.error("Invalid or missing reset code.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
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
            code: code,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successful! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(data.error.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full bg-white shadow-lg md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-2 space-y-2 md:space-y-3 sm:p-8 bg-slate-50">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Reset Your Password
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleResetPassword}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full font-bold text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm">
                Remembered your password?{" "}
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

export default ResetPassword;
