"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser,
  FaCartArrowDown,
  FaSearch,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [profile, setProfile] = useState(false);
  const [jwt, setJwt] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [profileImage, setProfileImage] = useState(null);
  const [isVendor, setIsVendor] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function getCookie(name) {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    }
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");
    setJwt(storedJwt);
    setUser(storedUser);

    if (
      !storedJwt ||
      storedJwt === "undefined" ||
      storedJwt === null ||
      !storedUser
    ) {
      setLogin(false);
      if (pathname.includes("profile")) {
        router.push("/login");
      }
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me?populate=*`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedJwt}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();

          if (userData && (userData.username || userData.name)) {
            setLogin(true);
            if (userData.profileImage?.url) {
              setProfileImage(userData.profileImage.url);
            }
          } else {
            setLogin(false);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      };

      const checkVendorStatus = async () => {
        const email = getCookie("user");
        if (!email) return null;

        const encodedEmail = encodeURIComponent(email);

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch vendor data");
          }

          const data = await response.json();
          setIsVendor(data.data.length != 0);
        } catch (error) {
          console.error("Error while checking vendor status:", error);
        }
      };

      checkVendorStatus();
      fetchUserData();
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setTimeout(() => {
          setProfile(false);
        }, 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname, jwt]);

  const handleUserClick = () => {
    if (!login) {
      router.push("/login");
    }
  };

  const toggleProfile = () => {
    setProfile(!profile);
  };

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setJwt(undefined);
    setUser(undefined);
    setProfileImage(null);
    setProfile(false);
    setLogin(false);
  };

  if (pathname.includes("/vendor/")) {
    return null;
  }

  return (
    <>
      <nav className="bg-white border-gray-200 h-16 max-h-16 sticky top-0 w-full z-50 shadow-lg">
        <div className="max-w-screen-xl flex flex-wrap items-center md:justify-around justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3">
            <img
              height={36}
              width={48}
              src="/logo.png"
              className="w-12 h-fit scale-150"
              alt={process.env.NEXT_PUBLIC_NAME}
            />
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400"
            >
              <FaSearch />
            </Link>
            <Link
              href="/cart"
              className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400"
            >
              <FaCartArrowDown />
            </Link>
            {login ? (
              <div
                onClick={toggleProfile}
                ref={profileRef}
                className="flex h-10 w-10 cursor-pointer items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400"
              >
                <span className="sr-only">Open user menu</span>
                {profileImage ? (
                  <Image
                    height={32}
                    width={32}
                    className="w-8 h-8 rounded-full"
                    src={profileImage}
                    alt="user photo"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
            ) : (
              <button
                onClick={handleUserClick}
                className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400"
              >
                <span className="sr-only">Open user menu</span>
                <FaUser />
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-user"
              aria-expanded={menuOpen ? "true" : "false"}
              onBlur={() => {
                setTimeout(() => {
                  setMenuOpen(false);
                }, 50);
              }}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 font-semibold md:p-0"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {profile && (
        <div className="fixed md:right-4 right-4 top-16 z-10 mt-2 w-56 bg-white border rounded-md shadow-lg">
          <ul className="flex flex-col">
            <li>
              <Link
                href="/profile/account-settings"
                onClick={() => setProfile(false)}
                className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100"
              >
                <FaUserAlt className="mr-2 inline" /> Account Settings
              </Link>
            </li>
            <li>
              <Link
                href="/profile/order-history"
                onClick={() => setProfile(false)}
                className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100"
              >
                <FaCartArrowDown className="mr-2 inline" /> Order History
              </Link>
            </li>
            <li>
              <Link
                href={isVendor ? "/vendor/dashboard" : "/become-vendor"}
                onClick={() => setProfile(false)}
                className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100"
              >
                <FaShop className="mr-2 inline " /> Vendor Profile
              </Link>
            </li>
            <li>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100"
              >
                <FaSignOutAlt className="mr-2 inline" /> Logout
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
