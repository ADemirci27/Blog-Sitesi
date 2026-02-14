import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    });

    if (!comment || comment.userId !== decoded.userId) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Yorum silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const { content } = await req.json();

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    });

    if (!comment || comment.userId !== decoded.userId) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    const updated = await prisma.comment.update({
      where: { id: params.id },
      data: { content },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
