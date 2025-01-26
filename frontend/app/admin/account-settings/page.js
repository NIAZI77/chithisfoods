"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
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
    const storedAdmin = getCookie("admin");

    if (!storedJwt && !storedUser && !storedAdmin) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  return (
    <div className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      Page
    </div>
  );
};

export default Page;
