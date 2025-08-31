"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Home,
  ShoppingBag,
  Settings,
  Users,
  Package,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate();
  };

  return (
    
    <aside className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-md md:shadow-none">
      {/* Mobile Close */}
      {/* <button
        onClick={onNavigate}
        className="md:hidden self-end m-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Close menu"
      >
        <X size={20} className="text-gray-500 dark:text-gray-400" />
      </button> */}

      {/* User Info */}
      <div className="flex items-center gap-3 md:mt-0 mt-20 px-6 pb-6 border-r-0 border-b border-gray-200 dark:border-gray-800">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={42}
            height={42}
            className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
            {session?.user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {[
          { icon: Home, label: "Dashboard", path: "/dashboard" },
          { icon: ShoppingBag, label: "Shop", path: "/products" },
          { icon: Settings, label: "Settings", path: "/settings" },
        ].map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 
                       hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <Icon
              size={18}
              className="text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
            />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}

        {/* Admin Section */}
        {session?.user?.role === "admin" && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 px-4">
              Admin
            </p>
            {[
              { icon: Package, label: "Manage Orders", path: "/admin/orders" },
              { icon: Users, label: "Manage Users", path: "/admin/users" },
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 
                           hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <Icon
                  size={18}
                  className="text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => handleNavigation("/api/auth/signout")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 
                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium group w-full"
        >
          <LogOut
            size={18}
            className="text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors"
          />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
