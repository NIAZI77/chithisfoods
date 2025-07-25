"use client";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";
import DishCard from "@/app/components/DishCard";
import VerificationBadge from "@/app/components/VerificationBadge";
import { UserX, ArrowLeft, Search } from "lucide-react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState(null);
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const params = useParams();
  const username = params.username.replace(/%40/g, "");

  useEffect(() => {
    if (username) {
      getVendor(username);
    }
  }, [username]);

  const getVendorMenu = async (id) => {
    if (!id) return;

    setMenuLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[vendorId][$eq]=${id}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && Array.isArray(data.data)) {
        const sorted = data.data.sort((a, b) => {
          const catA = (a.category || "").toLowerCase();
          const catB = (b.category || "").toLowerCase();
          if (catA !== catB) return catA.localeCompare(catB);

          const subA = (a.subcategory || "").toLowerCase();
          const subB = (b.subcategory || "").toLowerCase();
          return subA.localeCompare(subB);
        });
        setMenu(sorted);
      }
    } catch (error) {
      console.error("Could not fetch vendor menu. Please try again.");
      setMenu([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const getVendor = async (username) => {
    if (!username) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[username][$eq]=${username}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data.data) && data.data.length > 0) {
        setVendorData(data.data[0]);
        if (data.data[0].documentId) {
          getVendorMenu(data.data[0].documentId);
        }
      } else {
        setVendorData(null);
      }
    } catch (error) {
      console.error("Could not verify your vendor status. Please try again.");
      setVendorData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || menuLoading) return <Loading />;

  if (!vendorData)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <UserX className="w-12 h-12 text-rose-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-rose-600 capitalize">
            Vendor not found
          </h3>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn&apos;t locate this vendor.
            <br />
            <span className="text-gray-500 text-sm flex items-center justify-center gap-2 text-center my-2">
              <Search className="w-4 h-4" /> @{username}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore Vendors
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="md:w-[80%] w-[90%] mx-auto">
      <section className="relative">
        {vendorData?.coverImage?.url && (
          <img
            src={vendorData.coverImage.url}
            alt="Cover Image"
            className="w-full h-auto aspect-4/1 object-cover rounded-lg"
          />
        )}
        {vendorData?.avatar?.url && (
          <img
            src={vendorData.avatar.url}
            alt="Profile"
            className="md:w-48 md:h-48 w-24 h-24 rounded-full object-cover relative md:bottom-16 bottom-8 left-5 border-white border-8"
          />
        )}
        <div className="lg:mb-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[75%] xl:w-[80%] pl-4 -mt-6 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
            {vendorData?.storeName || "Vendor Name"}
            <VerificationBadge
              status={vendorData?.verificationStatus}
              size="small"
            />
          </h2>
          <span className="block text-sm hover:underline text-gray-500">
            @{username}
          </span>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {vendorData?.bio ||
              "Welcome to our store! We take pride in offering high-quality products and exceptional service to our valued customers. Browse through our menu discover our delicious."}
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed bg-slate-50 px-4 rounded-full w-fit">
            {vendorData?.businessAddress}, {vendorData?.city}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-800 font-semibold ml-1">
                {vendorData?.rating || 0}
              </span>
            </div>
            <div className="flex items-center bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium gap-1">
              <FaMapMarkerAlt size={14} />
              {vendorData?.city}, {vendorData?.zipcode}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="relative my-8 flex items-center justify-center overflow-hidden">
          <Separator />
          <div className="px-2 text-center bg-background text-sm">MENU</div>
          <Separator />
        </div>

        {menu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {menu.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
            <p className="text-lg font-medium">No menu available</p>
            <p className="text-sm mt-2">
              This vendor hasn&apos;t added any dishes yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
