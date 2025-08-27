"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";

import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaGear, FaShop } from "react-icons/fa6";
import { RiFileList2Fill } from "react-icons/ri";
import { ShoppingCart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import Loading from "../loading";
import { getCartItemCount } from "../lib/utils";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  // Function to count total dishes across all vendor groups
  const getTotalDishCount = () => {
    return cartItems.reduce((total, vendorGroup) => {
      return total + vendorGroup.dishes.length;
    }, 0);
  };

  const checkIfVendor = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data?.data?.length > 0) {
        setVendorStatus(data.data[0].verificationStatus);
      } else {
        setVendorStatus(null);
      }
    } catch (err) {
      toast.error(
        "We're having trouble loading your profile information right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");

    if (jwt && user) {
      setIsLoggedIn(true);
      checkIfVendor(user);
    }
  }, []);

  useEffect(() => {
    const loadCartData = () => {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        try {
          const parsedCart = JSON.parse(cartData);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
        }
      }
    };

    loadCartData();
    
    // Listen for cart updates from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartData();
      }
    };

    // Listen for cart updates from the same tab
    const handleCartUpdate = () => {
      loadCartData();
    };

    // Listen for zipcode changes to clear cart
    const handleZipcodeChange = () => {
      setCartItems([]);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdate', handleCartUpdate);
    window.addEventListener('zipcodeChange', handleZipcodeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdate', handleCartUpdate);
      window.removeEventListener('zipcodeChange', handleZipcodeChange);
    };
  }, []);

  useEffect(() => {
    const jwt = getCookie("jwt");
    const user = getCookie("user");
    if (jwt && user) {
      setIsLoggedIn(true);
    }
    if (pathname.includes("/vendor/") || pathname.includes("/admin/")) {
      return;
    }
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("jwt");
    deleteCookie("user");
    setIsLoggedIn(false);
    toast.success("You've been successfully logged out. See you soon!");
    localStorage.clear();
    router.push("/");
  };

  if (loading) return <Loading />;

  if (pathname.includes("/vendor/") || pathname.includes("/admin/")) {
    return;
  }
  return (
    <nav className="bg-transparent w-full border-gray-200 md:h-20 md:max-h-20 h-16 max-h-16 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between w-full mx-auto md:p-5 p-3 md:px-12">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 md:w-20 h-auto"
          />
        </Link>

        <div className="flex items-center md:order-2 space-x-1 md:space-x-0">
          <Link
            href="/cart"
            className="h-10 w-10 text-xl flex items-center justify-center rounded-full text-rose-500 hover:text-rose-600 hover:scale-125 transition-all relative"
          >
            <ShoppingCart />
            {getTotalDishCount() > 0 && (
              <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center font-bold">
                {getTotalDishCount()}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="h-10 w-10 text-xl flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <User className="text-rose-500 hover:text-rose-600 hover:scale-125 transition-all" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link
                    href="/profile/settings"
                    className="flex items-center justify-left"
                  >
                    <DropdownMenuItem className="w-full">
                      <FaGear className="mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link
                    href="/profile/order-history"
                    className="flex items-center justify-left"
                  >
                    <DropdownMenuItem className="w-full">
                      <RiFileList2Fill className="mr-2" />
                      <span>Order History</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link
                    href={
                      vendorStatus ? "/vendor/dashboard" : "/become-a-vendor"
                    }
                    className="flex items-center justify-left"
                  >
                    <DropdownMenuItem className="w-full">
                      <FaShop className="mr-2" />
                      <span>Vendor Profile</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="w-full" onClick={handleLogout}>
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Login</span> <FaSignInAlt />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
