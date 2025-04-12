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
} from "react-icons/fa";
import Hero from "../components/Hero";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />

      <div className="flex flex-col pt-10 items-center px-6 w-full">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
            Login to Chithi&apos;s Foods
          </h2>

          <form className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-500" />
              <input
                type="text"
                placeholder="Username or Email"
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
            <div>
              <Link
                href={"/forget-password"}
                className="block text-right hover:underline text-blue-600"
              >
                Forget Password?
              </Link>
            </div>
            <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
              Login
            </button>
          </form>

          <p className="text-center mt-4">
            Don’t have an account?
            <Link
              href="/signup"
              className="w-full text-center block text-rose-600 py-3 rounded-full border-2 border-rose-600 my-2 hover:bg-rose-600 hover:text-white transition-all"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaGoogle />
              <span>Sign in with Google</span>
            </button>
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaApple />
              <span>Sign in with Apple</span>
            </button>
            <button className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all">
              <FaFacebook />
              <span>Sign in with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
