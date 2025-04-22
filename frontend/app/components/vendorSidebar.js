"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSidebarCollapse } from "react-icons/go";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import {
  Boxes,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
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
        collapsed ? "w-fit" : "w-64"
      } transition-all duration-300 flex flex-col shadow-lg bg-white text-black fixed top-0 left-0`}
    >
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } py-2 px-3`}
      >
        {!collapsed && (
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="w-20 h-auto"
          />
        )}
        <button onClick={() => setCollapsed((prev) => !prev)}>
          <span className="text-2xl text-gray-700">
            {collapsed ? (
              <GoSidebarCollapse />
            ) : (
              <TbLayoutSidebarLeftCollapse />
            )}
          </span>
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-1 mt-3">
        <Link
          href="/vendor/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/10 ${
            isActive("/vendor/dashboard") ? "bg-white/10" : ""
          }`}
        >
          <LayoutDashboard />
          {!collapsed && <span className="whitespace-nowrap">Dashboard</span>}
        </Link>

        <Link
          href="/vendor/manage-inventory"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/10 ${
            isActive("/vendor/manage-inventory") ? "bg-white/10" : ""
          }`}
        >
          <Boxes />
          {!collapsed && (
            <span className="whitespace-nowrap">Manage Inventory</span>
          )}
        </Link>

        <Link
          href="/vendor/order-management"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/10 ${
            isActive("/vendor/order-management") ? "bg-white/10" : ""
          }`}
        >
          <ShoppingBag />
          {!collapsed && (
            <span className="whitespace-nowrap">Order Management</span>
          )}
        </Link>

        <Link
          href="/vendor/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/10 ${
            isActive("/vendor/settings") ? "bg-white/10" : ""
          }`}
        >
          <Settings />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}
