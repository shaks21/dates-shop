// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    // Get user with orders, order items, and product details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true, // Include product title
                  },
                },
              },
            },
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

    // Map orders to include product names
    const orders = user.orders.map((order) => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      total: order.total, // Use the stored total instead of recalculating
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        product: item.product.title, // Use product title instead of ID
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}