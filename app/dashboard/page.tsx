"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // Fetch user orders
  useEffect(() => {
    if (!session) return;

    async function fetchOrders() {
      try {
        setOrdersLoading(true);
        setError(null);
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
        const data = await res.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError(error instanceof Error ? error.message : "Failed to load orders");
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('aside');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 px-6">
        <p className="text-gray-800 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex bg-cream dark:bg-gray-900 py-5">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed  z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        <Menu size={10} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none border-r border-gray-200 dark:border-gray-700
      `}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-4 md:p-8 mt-14 md:mt-0"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            Your Orders
          </h1>

          {/* Orders Section */}
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="space-y-2 mb-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/5 ml-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have no orders yet. Start shopping to fill this section!
              </p>
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                      Order #{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 py-1 rounded w-fit ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-700/20 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/20 dark:text-yellow-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  
                  <ul className="mb-3 space-y-2">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm sm:text-base">
                        <span className="flex-1">
                          {item.product} × {item.quantity}
                        </span>
                        <span className="font-medium ml-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-right font-semibold text-gray-800 dark:text-white text-sm sm:text-base border-t pt-3">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}