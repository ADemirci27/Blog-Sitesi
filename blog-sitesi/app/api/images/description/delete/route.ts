import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Giriş yapmalısın" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const userId = decoded.userId;

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID gerekli" },
        { status: 400 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Fotoğraf bulunamadı" },
        { status: 404 }
      );
    }

    if (image.userId !== userId) {
      return NextResponse.json(
        { error: "Bu işlemi yapmaya yetkin yok" },
        { status: 403 }
      );
    }

    
    await prisma.image.update({
      where: { id: imageId },
      data: { description: "" },
    });

    return NextResponse.json({
      message: "Açıklama silindi",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Açıklama silinemedi" },
      { status: 500 }
    );
  }
}
