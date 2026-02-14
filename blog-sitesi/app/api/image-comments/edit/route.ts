import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserIdFromRequest(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return null;

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { id, content } = await req.json();

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const comment = await prisma.imageComment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: "Yorum bulunamadı" }, { status: 404 });
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "Bu yorumu düzenlemeye yetkin yok" },
        { status: 403 }
      );
    }

    const updated = await prisma.imageComment.update({
      where: { id },
      data: { content },
      include: { user: { select: { id: true, username: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Yorum güncellenemedi" },
      { status: 500 }
    );
  }
}
