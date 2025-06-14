"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (!AdminJWT || !AdminUser) {
      toast.error("Please login to continue.");
      router.push("/admin/login");
    } else {
      router.push("/admin/dashboard");
    }
  }, [router]);

  return <Loading />;
};

export default Page;
