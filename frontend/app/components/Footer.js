"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-white pt-10">
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
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/features" className="text-sm hover:underline">
                  Features
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/news" className="text-sm hover:underline">
                  News
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-sm hover:underline">
                  Menu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
              Company
            </h2>
            <ul className="text-gray-600 font-medium">
              <li className="mb-3">
                <Link
                  href="/why-chillis-food"
                  className="text-sm hover:underline"
                >
                  Why Chithi&apos;s Food?
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  href="/partner-with-us"
                  className="text-sm hover:underline"
                >
                  Partner With Us
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/faq" className="text-sm hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Support
              </h2>
              <ul className="text-gray-600 font-medium">
                <li className="mb-3">
                  <Link href="/account" className="text-sm hover:underline">
                    Account
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    href="/support-center"
                    className="text-sm hover:underline"
                  >
                    Support Center
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="/feedback" className="text-sm hover:underline">
                    Feedback
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="/contact-us" className="text-sm hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="text-sm hover:underline"
                  >
                    Accessibility
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
