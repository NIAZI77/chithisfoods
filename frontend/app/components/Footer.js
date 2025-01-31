"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.includes("/vendor/") || pathname.includes("/admin/")) {
    return null;
  }

  return (
    <footer className="bg-white z-50">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 md:py-8">
        <div className="md:flex md:justify-around">
          <div className="mb-6 md:mb-0 content-center">
            <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="flex items-center">
              <Image
                height={112}
                width={112}
                src="/logo.png"
                className="w-28"
                alt={process.env.NEXT_PUBLIC_NAME}
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Resources
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="hover:underline">
                    {process.env.NEXT_PUBLIC_NAME}
                  </Link>
                </li>
                <li>
                  <Link title={process.env.NEXT_PUBLIC_NAME} href="/menu" className="hover:underline">
                    Menu
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Legal
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link title={process.env.NEXT_PUBLIC_NAME} href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/vendor-privacy-policy"
                    className="hover:underline"
                  >
                    Vendor Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto md:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2023
            <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="hover:underline">
              {" "}
              {process.env.NEXT_PUBLIC_NAME}™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="text-gray-500 hover:text-gray-900 mr-5">
              <FaFacebook className="w-4 h-4" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="text-gray-500 hover:text-gray-900 mr-5">
              <FaInstagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link title={process.env.NEXT_PUBLIC_NAME} href="/" className="text-gray-500 hover:text-gray-900 mr-5">
              <FaTwitter className="w-4 h-4" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
