import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Fotoğraf bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Fotoğraf yüklenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

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

    console.log("DECODED TOKEN:", decoded);

    const userId =
      decoded.id ||
      decoded.userId ||
      decoded.sub ||
      decoded._id;

    console.log("TOKEN USER ID:", userId);

    const image = await prisma.image.findUnique({
      where: { id: params.id },
    });

    console.log("IMAGE OWNER ID:", image?.userId);

    if (!image) {
      return NextResponse.json(
        { error: "Fotoğraf bulunamadı" },
        { status: 404 }
      );
    }

    if (image.userId !== userId) {
      return NextResponse.json(
        { error: "Bu fotoğrafı silme yetkin yok" },
        { status: 403 }
      );
    }

    await prisma.imageReaction.deleteMany({
      where: {
        imageId: params.id,
      },
    });

    await prisma.imageComment.deleteMany({
      where: {
        imageId: params.id,
      },
    });

    await prisma.image.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Fotoğraf silindi" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Fotoğraf silinemedi" },
      { status: 500 }
    );
  }
}
