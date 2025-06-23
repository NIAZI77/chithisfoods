"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { toast } from "react-toastify";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (AdminJWT || AdminUser) {
      const isAdmin = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AdminJWT}`,
            },
          }
        );
        const data = await response.json();
        if (data.isAdmin) {
          return;
        } else {
          toast.error("You are not authorized to access this page.");
          deleteCookie("AdminJWT");
          deleteCookie("AdminUser");
          router.push("/admin/login");
          return;
        }
      };
      isAdmin();
    } else {
      toast.error("Please login to continue.");
      router.push("/admin/login");
    }
  }, [router]);

  return <Loading />;
};

export default Page;
