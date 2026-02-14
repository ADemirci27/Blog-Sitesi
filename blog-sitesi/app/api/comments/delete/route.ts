import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
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

    const { id } = await req.json();

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment || comment.userId !== decoded.userId) {
      return NextResponse.json({ error: "Bu yorumu silemezsiniz" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Yorum silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
