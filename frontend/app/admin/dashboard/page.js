"use client";

import { AiOutlineUser, AiOutlineBarChart } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const vendorData = await vendorResponse.json();
        if (vendorResponse.ok) {
          setVendorCount(vendorData.meta.pagination.total);
        }

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const userData = await userResponse.json();
        if (userResponse.ok) {
          setUserCount(userData.length);
        }

        const ordersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const ordersData = await ordersResponse.json();
        if (ordersResponse.ok) {
          setOrdersCount(ordersData.meta.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-xl font-bold space-x-2 flex items-center justify-center">
            <FaClipboardList />
            Total Orders
          </p>
          <p className="text-3xl font-bold text-center">{ordersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-xl font-bold space-x-2 flex items-center justify-center">
            <AiOutlineUser />
            Active Users
          </p>
          <p className="text-3xl font-bold text-center">{userCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-xl font-bold space-x-2 flex items-center justify-center">
            <AiOutlineBarChart />
            Total Vendors
          </p>
          <p className="text-3xl font-bold text-center">{vendorCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        <ul>
          <li className="flex justify-between py-2 border-b">
            <span>New order placed by John</span>
            <span className="text-gray-500">1 hour ago</span>
          </li>
          <li className="flex justify-between py-2 border-b">
            <span>New vendor registered</span>
            <span className="text-gray-500">3 hours ago</span>
          </li>
          <li className="flex justify-between py-2 border-b">
            <span>Payment failure from user123</span>
            <span className="text-gray-500">5 hours ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
