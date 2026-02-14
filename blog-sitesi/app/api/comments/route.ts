import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId gerekli" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Yorumlar getirilemedi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Yorum eklenemedi" }, { status: 500 });
  }
}
