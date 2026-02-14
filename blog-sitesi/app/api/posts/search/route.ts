import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            tag: {
              contains: query,
            },
          },
        ],
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.log("Search API ERROR:", error);
    return NextResponse.json(
      { error: "Arama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
