"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { toast, ToastContainer } from "react-toastify";

const GoogleAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      const accessToken = searchParams.get("access_token");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/google/callback?access_token=${accessToken}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          if (!data.user.isAdmin) {
            toast.success("Logged in successfully!");
            if (typeof window !== "undefined" && data?.jwt) {
              const expires = new Date();
              expires.setDate(expires.getDate() + 7);
              const expiresString = expires.toUTCString();
              document.cookie = `user=${data.user.email}; expires=${expiresString}; path=/`;
              document.cookie = `jwt=${data.jwt}; expires=${expiresString}; path=/`;
            }
            setTimeout(() => router.push("/"), 1000);
          } else {
            toast.error("You do not have access to the dashboard.");
            setTimeout(() => router.push("/login"), 1000);
          }
        } else {
          toast.error("An error occurred during login.");
          setTimeout(() => router.push("/login"), 1000);
        }
      } catch (err) {
        toast.error("An error occurred during login.");
        setTimeout(() => router.push("/login"), 1000);
      }
    };

    authenticate();
  }, [searchParams, router]);

  return (
    <>
      <Loading />
      <ToastContainer />
    </>
  );
};

export default GoogleAuth;
