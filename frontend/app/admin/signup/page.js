"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";
import Spinner from "@/components/WhiteSpinner";

const AdminSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // First, check if there are any existing admin users
      const checkAdminResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users?filters[isAdmin][$eq]=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!checkAdminResponse.ok) {
        throw new Error(
          `Failed to check existing admin users: ${checkAdminResponse.status}`
        );
      }

      const adminCheckData = await checkAdminResponse.json();
      const existingAdmins = Array.isArray(adminCheckData)
        ? adminCheckData
        : adminCheckData.data || [];

      // Determine admintype based on whether admin users exist
      const admintype = existingAdmins.length > 0 ? "regular" : "main";

      // Create the user account
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            username:
              email.split("@")[0] + Math.floor(Math.random() * 10000000),
            email,
            password,
          }),
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        if (registerData.error?.message?.includes("already exists")) {
          toast.error("An account with this email already exists");
        } else {
          toast.error(
            registerData.error?.message || "Failed to create user account"
          );
        }
        return;
      }

      // Determine admin verification status and admin privileges based on admintype
      let isAdmin = false;
      let isAdminVerified = "none";

      if (admintype === "main") {
        isAdmin = true;
        isAdminVerified = "verified";
      } else {
        isAdmin = false;
        isAdminVerified = "pending";
      }

      // Now update the user to set admin properties
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${registerData.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            isAdmin: isAdmin,
            admintype: admintype,
            isAdminVerified: isAdminVerified,
          }),
        }
      );

      if (updateResponse.ok) {
        if (admintype === "main") {
          toast.success(
            `Main Admin account created successfully! now you can access all features`
          );
        } else {
          toast.success(
            `Admin Account created successfully! Please wait for main admin to verify.`
          );
        }
        setTimeout(() => router.push("/admin/login"), 2000);
      } else {
        toast.error(
          "User created but failed to assign admin role. Please contact support."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        "We're having trouble connecting right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <Image
        height={100}
        width={100}
        src="/logo.png"
        alt="Chithi's Foods Logo"
        className="mb-8 w-56"
      />
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Admin Sign Up
        </h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full px-3 py-2 border border-gray-200 rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password (min 6 characters)"
                className="w-full px-3 py-2 border border-gray-200 rounded-md "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-200 rounded-md "
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Create Admin Account"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an admin account?{" "}
            <a
              href="/admin/login"
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
