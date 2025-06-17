"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";
import Loading from "@/app/loading";

const FacebookAuth = () => {
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
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/facebook/callback?access_token=${accessToken}`
        );

        const data = await response.json();

        if (response.ok) {
          if (data.user.isAdmin) {
            toast.error("Admin access denied");
            setTimeout(() => router.push("/login"), 1000);
            return;
          }
          
          // Check if user is blocked
          if (data.user.blocked) {
            setShowBlockedMessage(true);
            setTimeout(() => router.push("/login"), 1000);
            return;
          }
          
          toast.success("Welcome to Chithi's Foods!");
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

export default FacebookAuth;
