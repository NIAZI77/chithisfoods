"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.includes("/vendor/")) {
      return;
    }
  }, [pathname]);
  if (pathname.includes("/vendor/")) {
    return;
  }

  return (
    <footer className="bg-white pt-10 pb-3">
      <div className="mx-auto w-full max-w-screen-xl px-6 md:px-8">
        <div className="flex items-start justify-around flex-wrap">
          <div className="space-y-6 md:max-w-72">
            <Link href="/" className="inline-flex items-center">
              <Image
                height={48}
                width={48}
                src="/logo.png"
                alt="Logo"
                className="w-12 md:w-20"
                priority={true}
              />
            </Link>
            <p className="text-sm text-gray-700 leading-relaxed font-semibold tracking-wide">
              Fast delivery of delicious meals from multiple restaurants,
              bringing delicious meals to your doorstep.
            </p>
            <div className="flex items-center space-x-5 pb-5">
              <Link
                href="/"
                className="text-rose-500 hover:text-rose-600 transition-all duration-300 hover:scale-125"
              >
                <RiInstagramFill className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="/"
                className="text-rose-500 hover:text-rose-600 transition-all duration-300 hover:scale-125"
              >
                <FaFacebookF className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="/"
                className="text-rose-500 hover:text-rose-600 transition-all duration-300 hover:scale-125"
              >
                <FaTwitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
              About
            </h2>
            <ul className="text-gray-600 font-medium">
              <li className="mb-3">
                <Link
                  href="/about"
                  className="text-sm hover:underline hover:text-rose-500 transition-all"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  href="/features"
                  className="text-sm hover:underline hover:text-rose-500 transition-all"
                >
                  Features
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  href="/news"
                  className="text-sm hover:underline hover:text-rose-500 transition-all"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-sm hover:underline hover:text-rose-500 transition-all"
                >
                  Menu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Legal
              </h2>
              <ul className="text-gray-600 font-medium">
                <li className="mb-3">
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm hover:underline hover:text-rose-500 transition-all"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    href="/privacy-policy"
                    className="text-sm hover:underline hover:text-rose-500 transition-all"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    href="/vendor-privacy-policy"
                    className="text-sm hover:underline hover:text-rose-500 transition-all"
                  >
                    Vendor Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
