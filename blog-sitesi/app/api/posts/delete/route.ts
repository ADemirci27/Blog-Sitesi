import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Post id gerekli" },
        { status: 400 }
      );
    }

    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Yetkisiz - Giriş yapmalısın" },
        { status: 401 }
      );
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Yetkisiz - Token bulunamadı" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post bulunamadı" },
        { status: 404 }
      );
    }

    if (post.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: "Bu yazıyı silme yetkin yok" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Silindi" });
  } catch (error) {
    console.error("Delete route hatası:", error);

    return NextResponse.json(
      { error: "Silme hatası" },
      { status: 500 }
    );
  }
}
