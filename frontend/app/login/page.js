'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
        },
        body: JSON.stringify({
          identifier: username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Logged in successfully!");
        if (typeof window !== "undefined" && data?.jwt) {
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          const expiresString = expires.toUTCString();
          document.cookie = `user=${data.user.email}; expires=${expiresString}; path=/`;
          document.cookie = `jwt=${data.jwt}; expires=${expiresString}; path=/`;
        }
        setTimeout(() => { router.push("/") }, 1000);
      } else {
        toast.error(data.error?.message || "Invalid credentials.");
      }
    } catch (err) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white shadow-lg md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-slate-50">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Log In
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Your Username or Email
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                placeholder="Your Username or Email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full font-bold text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                SignUp
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;