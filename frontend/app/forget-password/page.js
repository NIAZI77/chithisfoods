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

export default function ForgetPassword() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />

      <div className="flex flex-col pt-10 items-center px-6 w-full">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
            Forget Password
          </h2>

          <form className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-500" />
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
              />
            </div>

            <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
              Send Reset Link
            </button>
          </form>

          <p className="text-center mt-4">
            Remember your password?
            <Link
              href="/login"
              className="w-full text-center block text-rose-600 py-3 rounded-full border-2 border-rose-600 my-2 hover:bg-rose-600 hover:text-white transition-all"
            >
              Login{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
