"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Users,
  User,
} from "lucide-react";
import { MdOutlinePayments } from "react-icons/md";
import { deleteCookie } from "cookies-next";
import { toast } from "react-toastify";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;
  useEffect(() => {
    if (!pathname.includes("/admin/") || pathname === "/admin/login") {
      return;
    }
  }, [pathname]);
  if (!pathname.includes("/admin/") || pathname === "/admin/login") {
    return;
  }
  return (
    <aside
      className={`h-screen ${collapsed ? "w-16" : "w-64"}
        } transition-all duration-300 flex flex-col shadow-lg bg-white text-black fixed top-0 left-0 z-50`}
    >
      <div
        className={`${
          collapsed
            ? "flex flex-col items-center gap-4"
            : "flex items-center justify-between"
        }
          py-4 px-3 border-b border-gray-100`}
      >
        <img
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className={`h-auto transition-all duration-300 ${
            collapsed ? "w-8" : "w-20"
          }
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
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent ${
            isActive("/admin/dashboard") &&
            "text-pink-600 !border-pink-600 !border-l-4 bg-pink-50"
          }
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Dashboard</span>
          )}
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent ${
            isActive("/admin/orders") &&
            "text-pink-600 !border-pink-600 !border-l-4 bg-pink-50"
          }
            }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Orders</span>
          )}
        </Link>

        <Link
          href="/admin/users-and-vendors"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent ${
            isActive("/admin/users-and-vendors") &&
            "text-pink-600 !border-pink-600 !border-l-4 bg-pink-50"
          }
            }`}
        >
          <Users className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">Users & Vendors</span>
          )}
        </Link>

        <Link
          href="/admin/payments"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent ${
            isActive("/admin/payments") &&
            "text-pink-600 !border-pink-600 !border-l-4 bg-pink-50"
          }
            }`}
        >
          <MdOutlinePayments className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">
              Payment Management
            </span>
          )}
        </Link>
        <Link
          href="/admin/global-settings"
          className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent ${
            isActive("/admin/global-settings") &&
            "text-pink-600 !border-pink-600 !border-l-4 bg-pink-50"
          }
            }`}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && (
            <span className="whitespace-nowrap font-medium">
              Global Settings
            </span>
          )}
        </Link>
        <button
          onClick={() => {
              deleteCookie("AdminJWT");
              deleteCookie("AdminUser");
              toast.success("You've been successfully logged out. See you soon!");
              localStorage.clear();
              // Notify navbar about cart update
              window.dispatchEvent(new CustomEvent('cartUpdate'));
              router.push("/");
            }}
          className="flex items-center gap-3 px-3 py-2.5 w-full transition-all duration-200 hover:bg-pink-700 hover:text-white border-l-[3px] border-transparent text-left font-medium"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </nav>
    </aside>
  );
}