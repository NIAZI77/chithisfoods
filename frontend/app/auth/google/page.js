"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

        if (response.ok) {
          toast.success("Logged in successfully!");
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          setCookie("jwt", data.jwt, { expires });
          setCookie("user", data.user.email, { expires });
          setTimeout(() => router.push("/"), 1000);
        } else {
          toast.error(data.error.message || "An error occurred during login.");
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
    </>
  );
};

export default GoogleAuth;
