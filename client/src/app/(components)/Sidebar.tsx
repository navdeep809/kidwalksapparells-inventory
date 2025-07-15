// components/Sidebar.tsx
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CogIcon,
  BoxIcon,
  DollarSignIcon,
  BarChartIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/products", label: "Products", icon: BoxIcon },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/dashboard/customers", label: "Customers", icon: UsersIcon },
  { href: "/dashboard/expenses", label: "Expenses", icon: DollarSignIcon },
  { href: "/dashboard/purchases", label: "Purchases", icon: BarChartIcon },
  { href: "/dashboard/settings", label: "Settings", icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear tokens/localStorage/session/etc.
    localStorage.removeItem("token"); // or whatever key you use

    // 2. Optional: Clear client state (like Redux, React Query cache, etc.)

    // 3. Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div
      className={clsx(
        "bg-zinc-900 text-white h-screen p-4 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && <h1 className="text-xl font-bold text-center">Kidwalksapparels</h1>}
        <button
          className="p-2 hover:bg-zinc-800 rounded"
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className={clsx(
              "flex items-center gap-3 p-4 rounded-md hover:bg-zinc-800 text-sm transition-all",
              pathname === href && "bg-zinc-800"
            )}
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full hover:bg-zinc-800 rounded-md text-sm"
        >
          <LogOutIcon className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
