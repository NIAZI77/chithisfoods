"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Boxes, LayoutDashboard, Settings, ShoppingBag, User } from "lucide-react";
import { MdOutlinePayments } from "react-icons/md";
import Image from "next/image";

export default function VendorSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  useEffect(() => {
    if (!pathname.includes("/vendor/")) {
      return;
    }
  }, [pathname]);
  if (!pathname.includes("/vendor/")) {
    return;
  }
  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col shadow-lg bg-white text-black fixed top-0 left-0 z-50`}
    >
      <div
        className={`${
          collapsed
            ? "flex flex-col items-center gap-4"
            : "flex items-center justify-between"
        } py-4 px-3 border-b border-gray-100`}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className={`h-auto transition-all duration-300 ${
            collapsed ? "w-8" : "w-20"
          }`}
        />
        <button onClick={() => setCollapsed((prev) => !prev)} className="p-1.5">
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 mt-3">
        <Link
          href="/vendor/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/dashboard") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Dashboard</span>
          )}
        </Link>

        <Link
          href="/vendor/manage-inventory"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/manage-inventory") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <Boxes className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">
              Manage Inventory
            </span>
          )}
        </Link>

        <Link
          href="/vendor/order-management"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/order-management") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">
              Order Management
            </span>
          )}
        </Link>
        <Link
          href="/vendor/payment"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/payment") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <MdOutlinePayments className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Payment</span>
          )}
        </Link>

        <Link
          href="/vendor/vendor-profile"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/vendor-profile") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <User className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Profile</span>
          )}
        </Link>

        <Link
          href="/vendor/settings"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-orange-400 hover:text-white border-l-[3px] border-transparent ${
            isActive("/vendor/settings") &&
            "text-orange-500 !border-orange-500 !border-l-4 bg-orange-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Settings</span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
