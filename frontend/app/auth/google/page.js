"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { setCookie } from "cookies-next";
import Loading from "@/app/loading";

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

        if (response.ok && data?.jwt && data?.user) {
          toast.success("Logged in successfully!");

          const options = {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          };

          setCookie("jwt", data.jwt, options);
          setCookie("user", JSON.stringify(data.user), options);

          setTimeout(() => router.push("/"), 1000);
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
