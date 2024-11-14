"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast,ToastContainer } from "react-toastify"; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:1337/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the JWT token in a cookie
        document.cookie = `token=${data.jwt}; path=/; max-age=604800`;  // 7 days expiry

        toast.success("Logged in successfully!");
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Invalid credentials. Please try again.";
        toast.error(errorMessage); // Show error toast on invalid login
      }
    } catch (err) {
      toast.error("Failed to log in. Please try again."); // Show error toast for network issues or other errors
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-24 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-orange-100">
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
                Don't have an account?
                <button
                  onClick={handleSignupRedirect}
                  className="font-medium text-orange-600 hover:text-orange-700"
                >
                  Sign Up
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

export default Login;