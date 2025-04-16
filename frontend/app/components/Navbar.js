"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaGear, FaShop } from "react-icons/fa6";
import { RiFileList2Fill } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const [login, setLogin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");
    setLogin(!!jwt && !!user);
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("jwt");
    deleteCookie("user");
    setLogin(false);
    router.push("/");
  };

  return (
    <nav className="bg-transparent w-full border-gray-200 md:h-20 md:max-h-20 h-16 max-h-16 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between w-full mx-auto md:p-5 p-3 md:px-12">
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
            className="h-10 w-10 text-xl flex items-center justify-center rounded-full text-rose-500 hover:text-rose-600 hover:scale-125 transition-all"
          >
            <Search />
          </Link>
          <Link
            href="/cart"
            className="h-10 w-10 text-xl flex items-center justify-center rounded-full text-rose-500 hover:text-rose-600 hover:scale-125 transition-all"
          >
            <ShoppingCart />
          </Link>

          {login ? (
            <div className="h-10 w-10 text-xl flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <User className="text-rose-500 hover:text-rose-600 hover:scale-125 transition-all" />
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
                  <DropdownMenuItem className="w-full" onClick={handleLogout}>
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
        </div>
      </div>
    </nav>
  );
}
