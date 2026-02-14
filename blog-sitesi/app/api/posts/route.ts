import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, tag } = body;

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const userId = decoded.userId;

    const slug =
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tag: tag || "genel",
        slug,
        authorId: userId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      { error: "Post oluşturulamadı" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const pageSize = 6;

    const posts = await prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPosts = await prisma.post.count();

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalPosts / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET error:", error);

    return NextResponse.json(
      { error: "Yazılar getirilemedi" },
      { status: 500 }
    );
  }
}
