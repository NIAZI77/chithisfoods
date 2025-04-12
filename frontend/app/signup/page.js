"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaApple,
  FaFacebook,
  FaGoogle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import Hero from "../components/Hero";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />
      <div className="flex flex-col pt-10 items-center px-6 w-full">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
            Create an Account
          </h2>

          <form className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-500" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
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
                className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?
            <Link
              href="/login"
              className="w-full text-center block text-rose-600 py-3 rounded-full border-2 border-rose-600 my-2 hover:bg-rose-600 hover:text-white transition-all"
            >
              Login
            </Link>
          </p>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaGoogle />
              <span>Sign up with Google</span>
            </button>
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaApple />
              <span>Sign up with Apple</span>
            </button>
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaFacebook />
              <span>Sign up with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
