"use client";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    profileImage: { id: 0, url: "" },
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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

    if (!storedJwt || !storedUser) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me?populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedJwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          id: data.id,
          username: data.username,
          profileImage: data.profileImage,
          email: data.email,
        });
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching user data");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const uploadImage = async (file, name) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      const { id, url } = data[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: { id, url },
      }));
      toast.success("Image uploaded successfully");

    } catch (error) {
      toast.error("Error uploading image");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      uploadImage(file, name);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    const storedJwt = getCookie("jwt");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${formData.id}?populate=*`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            profileImage: formData.profileImage
              ? formData.profileImage.id
              : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const data = await response.json();
      toast.success("User updated successfully");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setError(data.error.message);
      toast.error(data.error.message || "Error updating user data");
    }
    setSubmitting(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-[80%] mx-auto">
      <h1 className="font-bold text-2xl text-center py-4">Account Settings</h1>
      <div>
        <div className="flex-1">
          <input
            required
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mx-auto relative">
          <img
            height={100}
            width={100}
            src={
              formData.profileImage && formData.profileImage.url
                ? formData.profileImage.url
                : "/img.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <label
            className="w-5 h-5 overflow-hidden absolute left-9 bottom-0 cursor-pointer"
            htmlFor="profileImage"
          >
            <FaCamera />
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold pt-6">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-semibold pt-6">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 bg-gray-100"
          />
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="pt-6">
        <button
          onClick={() => router.push("/profile/changePassword")}
          className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Change Password
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;
