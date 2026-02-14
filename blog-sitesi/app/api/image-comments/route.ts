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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json(
      { error: "imageId gerekli" },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.imageComment.findMany({
      where: { imageId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Yorumlar getirilemedi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json(
      { error: "Yetkisiz" },
      { status: 401 }
    );
  }

  if (!body.content || !body.imageId) {
    return NextResponse.json(
      { error: "Eksik veri" },
      { status: 400 }
    );
  }

  try {
    const newComment = await prisma.imageComment.create({
      data: {
        content: body.content,
        imageId: body.imageId,
        userId: userId,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Yorum eklenemedi" },
      { status: 500 }
    );
  }
}
