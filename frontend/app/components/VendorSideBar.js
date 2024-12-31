"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";

const VendorSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (!pathname.includes("/vendor/")) {
    return null;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <AiOutlineDashboard />,
      path: "/vendor/dashboard",
    },
    {
      name: "Manage Inventory",
      icon: <MdOutlineInventory />,
      path: "/vendor/inventory",
    },
    { name: "Orders", icon: <AiOutlineShoppingCart />, path: "/vendor/orders" },
    {
      name: "Account Settings",
      icon: <AiOutlineSetting />,
      path: "/vendor/settings",
    },
  ];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        aria-expanded={isSidebarOpen ? "true" : "false"}
        className="md:hidden fixed top-4 right-4 z-50 bg-gray-100 rounded-md p-2 shadow-md"
      >
        {isSidebarOpen ? (
          <AiOutlineClose size={20} />
        ) : (
          <AiOutlineMenu size={20} />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-gray-50 text-gray-800 w-64 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:block`}
      >
        <div className="p-4 flex items-center justify-between md:justify-start">
          <Link href="/vendor/dashboard" className="flex items-center space-x-3">
            <img
              height={36}
              width={48}
              src="/logo.png"
              className="w-12 h-fit scale-150"
              alt={process.env.NEXT_PUBLIC_NAME}
            />
          </Link>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center py-3 px-6 hover:bg-gray-100 transition duration-200 ${
                pathname === item.path ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default VendorSideBar;
