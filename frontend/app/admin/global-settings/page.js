"use client";
import React, { useState, useEffect } from "react";
import TaxPercentage from "./components/TaxPercentage";
import AdminUsersTable from "./components/AdminUsersTable";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/app/loading";

const Page = () => {
  const router = useRouter();
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (AdminJWT || AdminUser) {
      const checkAdmin = async () => {
        try {
          setIsLoading(true);
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

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          if (data.isAdmin) {
            setCurrentUser(data);
            setIsMainAdmin(data.admintype === "main");
          } else {
            toast.error(
              "Sorry, you don't have permission to access this page."
            );
            deleteCookie("AdminJWT");
            deleteCookie("AdminUser");
            router.push("/admin/login");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          toast.error("Failed to verify admin status. Please try again.");
          deleteCookie("AdminJWT");
          deleteCookie("AdminUser");
          router.push("/admin/login");
        } finally {
          setIsLoading(false);
        }
      };
      checkAdmin();
    } else {
      toast.error("Please sign in to continue.");
      router.push("/admin/login");
    }
  }, [router]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-6 pl-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg">
            <svg
              className="w-6 h-6 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Global Settings</h1>
        </div>
      </div>

      {/* Tax Percentage Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-6">
          <TaxPercentage />
        </div>
      </div>

      {/* Admin Users Section */}
      <div className="mb-8">
        <AdminUsersTable isMainAdmin={isMainAdmin} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Page;
