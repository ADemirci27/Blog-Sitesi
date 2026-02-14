import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

function getUserIdFromToken() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded.userId;
  } catch {
    return null;
  }
}


export async function POST(req: Request) {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });
    }

    const body = await req.json();
    const { postId, imageId, favoriteId } = body;

    
    if (favoriteId) {
      await prisma.favorite.delete({
        where: { id: favoriteId },
      });

      return NextResponse.json({ removed: true });
    }

    
    if (!postId && !imageId) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        ...(postId ? { postId } : { imageId }),
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ removed: true });
    }

    await prisma.favorite.create({
      data: {
        userId,
        postId: postId || null,
        imageId: imageId || null,
      },
    });

    return NextResponse.json({ added: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "İşlem başarısız" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json([]);
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        post: {
          include: { author: true },
        },
        image: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json([]);
  }
}
