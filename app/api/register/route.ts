// app/api/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail"; // We'll implement this

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterBody = await request.json();
    const { email, password, name } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid email or password (min 6 chars)." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verified: false, // new field in schema
        verificationToken,
      },
    });

    // send verification email
    await sendVerificationEmail(user.email, verificationToken);

    return NextResponse.json(
      {
        ok: true,
        message: "User created. Verification email sent.",
        email: user.email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
