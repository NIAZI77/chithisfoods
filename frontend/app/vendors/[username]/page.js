"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import ProductCard from "../../components/ProductCard";
import { useParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState(null);
  let { username } = useParams();
  username = username.replace(/%40/g, "");

  useEffect(() => {
    getVendor(username);
  }, [username]);

  const getVendor = async (username) => {
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

      if (response.ok && data.data.length > 0) {
        setVendor(data.data[0]);
      }
    } catch (error) {
      console.error("Could not verify your vendor status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="md:w-[80%] w-[90%] mx-auto">
      <section className="relative">
        <Image
          src={vendor?.coverImage?.url}
          alt="cover Image"
          className="w-full aspect-video h-auto object-cover rounded-lg"
          width={100}
          height={100}
        />
        <Image
          src={vendor?.avatar?.url}
          alt="Profile"
          className="md:w-48 md:h-48 w-24 h-24 rounded-full object-cover relative md:bottom-16 bottom-8 left-5 border-white border-8"
          width={100}
          height={100}
        />
        <div className="lg:mb-0 lg:absolute lg:bottom-0 lg:right-0 lg:p-5 lg:w-[75%] xl:w-[80%]">
          <h2 className="text-lg font-semibold text-gray-800">
            {vendor?.storeName}
          </h2>
          <Link
            href={`/vendor/@${username}`}
            className="block text-sm hover:underline text-gray-500"
          >
            @{username}
          </Link>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam atque dicta perspiciatis tempore nobis similiqu. Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, aspernatur. Hic, perferendis tempora veniam, voluptatibus eius numquam, voluptates beatae laboriosam asperiores velit qui cumque magnam assumenda neque ducimus laudantium porro?
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed bg-rose-50 px-2 rounded-full w-fit">
            {vendor?.businessAddress}, {vendor?.city}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-800 font-semibold ml-1">
                {vendor?.rating || 0}
              </span>
            </div>
            <div className="flex items-center bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium gap-1">
              <FaMapMarkerAlt size={14} />
              {vendor?.city}, {vendor?.zipcode}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
