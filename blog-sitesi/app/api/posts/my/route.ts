import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json({ posts: [], images: [] });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ posts: [], images: [] });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Sunucu yapılandırma hatası" },
        { status: 500 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await prisma.post.findMany({
      where: {
        authorId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        tag: true,
      },
    });

    const images = await prisma.image.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        url: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      posts,
      images,
    });
  } catch (error) {
    console.error("Benim içeriklerim hatası:", error);

    return NextResponse.json({
      posts: [],
      images: [],
    });
  }
}
