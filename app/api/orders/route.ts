// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 
import { Order, OrderItem } from ".prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    // Get user with orders and order items
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          include: {
            orderItems: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ orders: [] });
    }

    // Map orders to include total per order
    const orders = user.orders.map(
      (order: Order & { orderItems: OrderItem[] }) => ({
        id: order.id,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        total: order.orderItems.reduce(
          (sum: number, item: OrderItem) => sum + item.price * item.quantity,
          0
        ),
        orderItems: order.orderItems.map((item: OrderItem) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
      })
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
