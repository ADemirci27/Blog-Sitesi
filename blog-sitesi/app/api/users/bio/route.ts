import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { bio } = await req.json();

    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        bio,
      },
    });

    return NextResponse.json({ message: "Biyografi güncellendi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Biyografi güncellenemedi" },
      { status: 500 }
    );
  }
}
