import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
    console.log("Verification token:", token);
  if (!token) {
    return NextResponse.redirect(
      new URL("/verify/error?reason=missing-token", req.nextUrl.origin)
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify/error?reason=invalid-token", req.nextUrl.origin)
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verified: true,
      },
    });

    return NextResponse.redirect(
      new URL("/verify/success", req.nextUrl.origin)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/verify/error?reason=server-error", req.nextUrl.origin)
    );
  }
}
