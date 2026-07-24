import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { password } = await req.json();
    const permit = await prisma.permit.findUnique({ where: { id: resolvedParams.id } });

    if (!permit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!permit.passwordHash) {
      return NextResponse.json({ success: true });
    }

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, permit.passwordHash);

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
