"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaEnvelope, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.includes("/vendor/") || pathname.includes("/admin/")) {
      return;
    }
  }, [pathname]);
  if (pathname.includes("/vendor/") || pathname.includes("/admin/")) {
    return;
  }

  return (
    <footer className="pt-10 pb-3 w-full sm:w-[90%] md:w-[80%] mx-auto">
      <div className="mx-auto w-full max-w-screen-xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center">
              <img src="/logo.png" alt="Logo" className="w-12 md:w-20 h-auto" />
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
                <FaXTwitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          {/* Contact Section */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Contact
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <a
                    href="mailto:info@chithisfoods.com"
                    className="text-sm text-gray-700 font-medium hover:text-rose-500 transition-colors"
                  >
                    info@chithisfoods.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <a
                    href="tel:3129856684"
                    className="text-sm text-gray-700 font-medium hover:text-rose-500 transition-colors"
                  >
                    (312) 985-6684
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 font-medium">
                    2501 Chatham Rd Springfield,<br/> IL 62704
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Legal Section */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Legal
              </h2>
              <ul className="text-gray-600 font-medium space-y-3">
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm hover:underline hover:text-rose-500 transition-all"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm hover:underline hover:text-rose-500 transition-all"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
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
