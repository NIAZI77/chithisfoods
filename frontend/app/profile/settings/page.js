"use client";

import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import Loading from "@/app/loading";
import Spinner from "@/app/components/Spinner";

export default function AccountSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [provider, setProvider] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userId, setUserId] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [jwt, setJwt] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const usernameRegex = /^[a-z0-9_]{3,15}$/;

  const getUser = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.error(data?.error?.message || "Error fetching user");
        toast.error(data?.error?.message || "Failed to load user");
        router.push("/login");
      } else {
        setUsername(data.username);
        setEmail(data.email);
        setProvider(data.provider);
        setUserId(data.id);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error fetching user data");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getCookie("jwt");
    const user = getCookie("user");

    if (!token || !user) {
      router.push("/login");
    } else {
      getUser(token);
      setJwt(token);
    }
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Username cannot be empty.");
      return;
    }

    if (!usernameRegex.test(username)) {
      toast.error(
        "Username must be 3–15 characters, lowercase, numbers, or underscores."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Username Changed Successfully");
        setUsername(data.username);
        setCookie("user", JSON.stringify(data), { path: "/" });
      } else {
        toast.error(data?.error?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Fill out all password fields.");
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 15) {
      toast.error("Password must be 6–15 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            currentPassword,
            password: newPassword,
            passwordConfirmation: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password Changed Successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(data?.error?.message || "Password change failed");
      }
    } catch (err) {
      toast.error("Error changing password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <section className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <form className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-500" />
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-3 pl-10 border outline-none rounded-lg opacity-50"
            />
          </div>

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

          <button
            onClick={handleProfileSave}
            disabled={savingProfile}
            className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save"}
          </button>
        </form>
      </section>

      {provider === "local" && (
        <section className="border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-500" />
              <input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-500" />
              <input
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-500" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border outline-rose-400 rounded-lg"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all disabled:opacity-50"
            >
              {savingPassword ? <Spinner/> : "Save"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
