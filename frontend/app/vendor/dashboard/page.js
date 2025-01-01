"use client"; 
import React, { useEffect } from "react"; 
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

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

  useEffect(() => {
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300">
      <h1>page</h1>
    </main>
  );
};

export default Page;
