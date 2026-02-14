import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });

    const token = cookieHeader.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
    if (!token || !process.env.JWT_SECRET) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const { postId, content } = await req.json();
    if (!postId || !content) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yorum gönderilemedi" }, { status: 500 });
  }
}
