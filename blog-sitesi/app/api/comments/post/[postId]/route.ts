import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { postId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yorumlar alınamadı" }, { status: 500 });
  }
}
