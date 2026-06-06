import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword 
      },
    });

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}