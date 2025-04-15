"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
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
import { getCookie } from "cookies-next";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const usernameRegex = /^[a-z0-9_]{3,15}$/;

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user) {
      router.push("/");
    }
  }, [router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 15) {
      toast.error("Password must be between 6 and 15 characters.");
      setLoading(false);
      return;
    }

    if (!usernameRegex.test(username)) {
      toast.error(
        "Username can contain lowercase letters, numbers, and underscores (3-15 chars)."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Sign up successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error(data?.error?.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/connect/google`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <Hero />
      <div className="flex flex-col pt-10 items-center px-6 w-full">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold md:mt-0 mt-10 mb-6">
            Create an Account
          </h2>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-500" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border outline-rose-400 rounded-lg"
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
              {loading ? "Signing Up..." : "Sign Up"}
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
          <div className="relative my-4 flex items-center justify-center overflow-hidden">
            <Separator />
            <div className="px-2 text-center bg-background text-sm">OR</div>
            <Separator />
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-start border p-3 px-10 rounded-full space-x-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-all"
            >
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
