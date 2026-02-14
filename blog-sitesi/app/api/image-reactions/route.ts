import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json({ error: "imageId gerekli" }, { status: 400 });
  }

  const likes = await prisma.imageReaction.count({
    where: {
      imageId,
      type: "LIKE",
    },
  });

  const dislikes = await prisma.imageReaction.count({
    where: {
      imageId,
      type: "DISLIKE",
    },
  });

  return NextResponse.json({ likes, dislikes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageId, type } = body;

    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const existing = await prisma.imageReaction.findFirst({
      where: {
        imageId,
        userId,
      },
    });

    // 👇 Eğer aynı reaksiyona tekrar basıldıysa SİL
    if (existing && existing.type === type) {
      await prisma.imageReaction.delete({
        where: {
          id: existing.id,
        },
      });

      return NextResponse.json({ message: "Reaction kaldırıldı" });
    }

    // 👇 Eğer farklı bir reaksiyon varsa GÜNCELLE
    if (existing) {
      const updated = await prisma.imageReaction.update({
        where: {
          id: existing.id,
        },
        data: {
          type,
        },
      });

      return NextResponse.json(updated);
    }

    // 👇 Yoksa YENİ OLUŞTUR
    const reaction = await prisma.imageReaction.create({
      data: {
        imageId,
        userId,
        type,
      },
    });

    return NextResponse.json(reaction);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Reaksiyon işlemi başarısız" },
      { status: 500 }
    );
  }
}
