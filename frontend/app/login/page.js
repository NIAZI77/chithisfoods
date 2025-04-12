"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { setCookie, getCookie } from "cookies-next";
import Hero from "../components/Hero";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");
    if (jwt && user) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            identifier: username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
          toast.success("Logged in successfully!");
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          setCookie("user", data.user.email, { expires });
          setCookie("jwt", data.jwt, { expires });
          setTimeout(() => router.push("/"), 1000);
       
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />
      <div className="flex flex-col pt-10 items-center px-6 w-full">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
            Login to Chithi&apos;s Foods
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-500" />
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <div>
              <Link
                href="/forget-password"
                className="block text-right hover:underline text-blue-600 text-sm"
              >
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?
            <Link
              href="/signup"
              className="w-full text-center block text-rose-600 py-3 rounded-full border-2 border-rose-600 my-2 hover:bg-rose-600 hover:text-white transition-all font-medium"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-6 space-y-3">
            <button
              className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all"
              onClick={() =>
                router.push(
                  `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/connect/google/`
                )
              }
            >
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
      <ToastContainer />
    </div>
  );
}
