"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    const jwt = getCookie("jwt");
    const storedUser = getCookie("user");
    setJwt(jwt);
    if (!jwt || !storedUser) {
      router.push("/login");
      return;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const jwt = getCookie("jwt");
    if (!jwt) {
      toast.error("JWT token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            password: formData.newPassword,
            passwordConfirmation: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(data.error.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="md:text-2xl text-xl font-bold mb-6">Change Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-orange-700"
          >
            Current Password
          </label>
          <input
            required
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="••••••••"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-orange-700"
          >
            New Password
          </label>
          <input
            required
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-orange-700"
          >
            Confirm New Password
          </label>
          <input
            required
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
