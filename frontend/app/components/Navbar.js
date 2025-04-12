"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaGear, FaShop } from "react-icons/fa6";
import { RiFileList2Fill, RiMenu3Fill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [login, setLogin] = useState(true);
  const closeMenuOnBlur = () => {
    setTimeout(() => setMenuOpen(false), 50);
  };
  return (
    <>
      <nav className="bg-transparent w-full border-gray-200 md:h-20 md:max-h-20 h-16 max-h-16 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center md:justify-around justify-between w-full mx-auto md:p-5 p-3">
          <Link href="/">
            <Image
              height={48}
              width={48}
              src="/logo.png"
              alt="Logo"
              className="w-12 md:w-20"
              priority={true}
            />
          </Link>

          <div className="flex items-center md:order-2 space-x-1 md:space-x-0">
            <Link
              href="/search"
              className="h-10 w-10 text-xl flex items-center justify-center rounded-full hover:text-rose-500 transition-all"
            >
              <FaSearch />
            </Link>
            <Link
              href="/cart"
              className="h-10 w-10 text-xl flex items-center justify-center rounded-full hover:text-rose-500 transition-all"
            >
              <FaShoppingCart />
            </Link>

            {login ? (
              <div className="h-10 w-10 text-xl flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <FaUser className="hover:text-rose-500 transition-all" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="m-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Link
                      href={"/profile/settings"}
                      className="flex items-center justify-left"
                    >
                      <DropdownMenuItem className="w-full">
                        <FaGear className="mr-2" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>

                    <Link
                      href={"/profile/order-history"}
                      className="flex items-center justify-left"
                    >
                      <DropdownMenuItem className="w-full">
                        <RiFileList2Fill className="mr-2" />
                        <span>Order History</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      href={"/become-a-vendor"}
                      className="flex items-center justify-left"
                    >
                      <DropdownMenuItem className="w-full">
                        <FaShop className="mr-2" />
                        <span>Vendor Profile</span>
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="w-full">
                      <FaSignOutAlt /> <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all flex items-center justify-center  space-x-2"
              >
                <span>Login</span> <FaSignInAlt />
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden font-bold"
              aria-controls="navbar-user"
              aria-expanded={menuOpen ? "true" : "false"}
              onBlur={closeMenuOnBlur}
            >
              {menuOpen ? (
                <CgClose className="w-full h-full" />
              ) : (
                <RiMenu3Fill className="w-full h-full" />
              )}
            </button>
          </div>

          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 rounded-lg md:space-x-8 md:flex-row md:border-0 bg-slate-50 md:bg-transparent">
              <li>
                <Link
                  href="/menu"
                  className="py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 font-semibold md:p-0 flex items-center justify-center"
                >
                  <BiSolidFoodMenu className="inline mr-1" /> Menu
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
