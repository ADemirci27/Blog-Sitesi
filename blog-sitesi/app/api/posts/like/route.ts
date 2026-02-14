import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId gerekli" },
        { status: 400 }
      );
    }

    const likes = await prisma.postReaction.count({
      where: {
        postId,
        type: "LIKE", 
      },
    });

    const dislikes = await prisma.postReaction.count({
      where: {
        postId,
        type: "DISLIKE", 
      },
    });

    return NextResponse.json({
      likes,
      dislikes,
    });
  } catch (error) {
    console.error("Like sayıları getirme hatası:", error);

    return NextResponse.json(
      { error: "Veri alınamadı" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { postId, type } = await req.json();

    if (!postId || !type) {
      return NextResponse.json(
        { error: "Eksik veri" },
        { status: 400 }
      );
    }

    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Yetkisiz" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const existing = await prisma.postReaction.findUnique({
      where: {
        userId_postId: {
          userId: decoded.userId,
          postId,
        },
      },
    });

    
    if (existing) {
      if (existing.type === type) {
        await prisma.postReaction.delete({
          where: { id: existing.id },
        });

        return NextResponse.json({
          message: "Oy kaldırıldı",
        });
      }

      await prisma.postReaction.update({
        where: { id: existing.id },
        data: { type },
      });

      return NextResponse.json({
        message: "Oy güncellendi",
      });
    }

    
    await prisma.postReaction.create({
      data: {
        type, 
        userId: decoded.userId,
        postId,
      },
    });

    return NextResponse.json({
      message: "Oy kaydedildi",
    });
  } catch (error) {
    console.error("Like işlemi hatası:", error);

    return NextResponse.json(
      { error: "İşlem başarısız" },
      { status: 500 }
    );
  }
}
