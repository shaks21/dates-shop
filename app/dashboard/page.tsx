"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

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

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // Fetch user orders
  useEffect(() => {
    if (!session) return;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 px-6">
        <p className="text-gray-800 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-8"
      >
        {/* User Info */}
        <div className="flex items-center mb-8 gap-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Welcome, {session.user?.name || "Valued Customer"}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{session.user?.email}</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-white mb-4">
            Your Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              You have no orders yet. Start shopping to fill this section!
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      Order #{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
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
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <ul className="mb-2">
                    {order.orderItems.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.product} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-semibold text-gray-800 dark:text-white">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full py-3 mt-4 bg-amber-600 text-white uppercase tracking-wider text-sm hover:bg-amber-700 transition-colors duration-300 rounded"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
